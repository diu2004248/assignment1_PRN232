import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductForm } from "@/components/products/ProductForm";
import { useProduct, useUpdateProduct } from "@/hooks/useProducts";
import { ProductInsert } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id!);
  const updateProduct = useUpdateProduct();

  const handleSubmit = async (data: ProductInsert) => {
    await updateProduct.mutateAsync({ id: id!, product: data });
    navigate(`/products/${id}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="mx-auto max-w-2xl space-y-6">
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-1/2" />
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
            The product you're trying to edit doesn't exist.
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
        <ProductForm 
          product={product}
          onSubmit={handleSubmit}
          isSubmitting={updateProduct.isPending}
        />
      </div>
    </Layout>
  );
}
