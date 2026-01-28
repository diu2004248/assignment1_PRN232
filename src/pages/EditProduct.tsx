import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProduct, updateProduct, ProductUpdate } from "@/lib/supabase";
import { Navbar } from "@/components/products/Navbar";
import { ProductForm } from "@/components/products/ProductForm";
import { LoadingSpinner } from "@/components/products/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { Package } from "lucide-react";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (data: ProductUpdate) => updateProduct(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast({ title: "Product updated successfully!" });
      navigate(`/products/${id}`);
    },
    onError: () => {
      toast({ title: "Failed to update product", variant: "destructive" });
    },
  });

  const handleSubmit = async (data: ProductUpdate) => {
    await mutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background noise-overlay">
        <Navbar />
        <div className="pt-24">
          <LoadingSpinner text="Loading product..." />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background noise-overlay">
        <Navbar />
        <div className="page-container py-32 text-center fade-in">
          <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
            Product Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            The product you're trying to edit doesn't exist.
          </p>
          <Link to="/" className="btn-primary inline-block">
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <Navbar />

      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
      </div>

      <div className="page-container pt-28 pb-16 md:pt-32 md:pb-24 relative z-10">
        <div className="max-w-2xl mx-auto slide-up">
          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            isLoading={mutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
