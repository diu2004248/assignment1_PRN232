-- Create products table for the clothing e-commerce platform
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for this demo)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can view products)
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

-- Allow public insert (for demo purposes - in production, restrict to admins)
CREATE POLICY "Anyone can create products" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

-- Allow public update (for demo purposes)
CREATE POLICY "Anyone can update products" 
ON public.products 
FOR UPDATE 
USING (true);

-- Allow public delete (for demo purposes)
CREATE POLICY "Anyone can delete products" 
ON public.products 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();