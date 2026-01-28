import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createProduct, ProductInsert } from "@/lib/supabase";
import { Navbar } from "@/components/products/Navbar";
import { ProductForm } from "@/components/products/ProductForm";
import { useToast } from "@/hooks/use-toast";

const CreateProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: ProductInsert) => createProduct(data),
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Product created successfully!" });
      navigate(`/products/${newProduct.id}`);
    },
    onError: () => {
      toast({ title: "Failed to create product", variant: "destructive" });
    },
  });

  const handleSubmit = async (data: ProductInsert) => {
    await mutation.mutateAsync(data);
  };

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <Navbar />

      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      </div>

      <div className="page-container pt-28 pb-16 md:pt-32 md:pb-24 relative z-10">
        <div className="max-w-2xl mx-auto slide-up">
          <ProductForm
            onSubmit={handleSubmit}
            isLoading={mutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
