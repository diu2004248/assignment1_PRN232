import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProduct, deleteProduct } from "@/lib/supabase";
import { Navbar } from "@/components/products/Navbar";
import { LoadingSpinner } from "@/components/products/LoadingSpinner";
import { DeleteDialog } from "@/components/products/DeleteDialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Edit2, Trash2, Package, ShoppingBag, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Product deleted successfully" });
      navigate('/');
    },
    onError: () => {
      toast({ title: "Failed to delete product", variant: "destructive" });
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The product you're looking for doesn't exist or has been removed.
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

      <div className="page-container pt-28 pb-16 md:pt-32 md:pb-24">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all group mb-10"
        >
          <div className="p-2 rounded-xl bg-muted group-hover:bg-muted/80 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium">Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 slide-up">
          {/* Product Image */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted border border-border">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                  <ShoppingBag className="w-20 h-20 opacity-50" />
                  <span className="text-sm uppercase tracking-widest">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex-1">
              {/* Badge */}
              <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-4 px-3 py-1 rounded-full bg-primary/10">
                In Stock
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                {product.name}
              </h1>
              
              <p className="price-tag text-3xl md:text-4xl mb-8">
                {formatPrice(product.price)}
              </p>

              <div className="card-glass p-6 rounded-2xl mb-8">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">Description</h3>
                <p className="text-foreground leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Added {formatDate(product.created_at)}</span>
                </div>
                {product.updated_at !== product.created_at && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="text-muted-foreground">Updated {formatDate(product.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-10 border-t border-border">
              <Button
                asChild
                className="flex-1 btn-primary h-14 text-base"
              >
                <Link to={`/products/${product.id}/edit`}>
                  <Edit2 className="w-5 h-5 mr-2" />
                  Edit Product
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="h-14 px-8 rounded-xl border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => deleteMutation.mutate(product.id)}
        productName={product.name}
      />
    </div>
  );
};

export default ProductDetail;
