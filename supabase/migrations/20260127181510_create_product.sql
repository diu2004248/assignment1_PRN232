-- Create products table for the clothing e-commerce platform
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public read access, no restrictions for demo)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products (public storefront)
CREATE POLICY "Products are publicly readable"
ON public.products
FOR SELECT
USING (true);

-- Allow anyone to create products
CREATE POLICY "Anyone can create products"
ON public.products
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update products
CREATE POLICY "Anyone can update products"
ON public.products
FOR UPDATE
USING (true);

-- Allow anyone to delete products
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

-- Insert some sample clothing products
INSERT INTO public.products (name, description, price, image) VALUES
('Cashmere Oversized Sweater', 'Luxuriously soft cashmere blend sweater with relaxed fit. Perfect for layering in colder months.', 189.00, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800'),
('Tailored Wool Blazer', 'Classic single-breasted blazer crafted from premium Italian wool. A timeless wardrobe essential.', 425.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'),
('Organic Cotton T-Shirt', 'Minimalist everyday essential made from 100% organic cotton. Breathable and sustainable.', 65.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'),
('High-Waisted Linen Trousers', 'Elegant wide-leg trousers in premium European linen. Effortlessly chic for any occasion.', 195.00, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'),
('Leather Weekend Bag', 'Hand-stitched full-grain leather duffle bag. Spacious interior with brass hardware details.', 545.00, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'),
('Merino Wool Cardigan', 'Lightweight merino wool cardigan with mother-of-pearl buttons. Versatile layering piece.', 225.00, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800');