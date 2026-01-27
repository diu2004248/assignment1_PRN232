import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useProduct, useDeleteProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id!);
  const deleteProduct = useDeleteProduct();

  const handleDelete = () => {
    deleteProduct.mutate(id!, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  const formattedPrice = product
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(product.price)
    : "";

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="grid gap-12 lg:grid-cols-2">
            <Skeleton className="aspect-[3/4] rounded-sm" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl">Product not found</h1>
          <p className="mt-2 text-muted-foreground">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button className="mt-6">Back to Shop</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 gap-2 pl-0 hover:bg-transparent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Button>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="animate-fade-in">
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-display text-8xl text-muted-foreground/30">
                    {product.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="animate-slide-up flex flex-col">
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-medium">{formattedPrice}</p>
            
            <p className="mt-6 text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="mt-8 flex gap-4">
              <Link to={`/products/${product.id}/edit`}>
                <Button variant="outline" className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit Product
                </Button>
              </Link>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{product.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={deleteProduct.isPending}
                    >
                      {deleteProduct.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="mt-auto pt-12 text-xs text-muted-foreground">
              <p>Added {new Date(product.created_at).toLocaleDateString()}</p>
              {product.updated_at !== product.created_at && (
                <p>Last updated {new Date(product.updated_at).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
