import { Layout } from "@/components/layout/Layout";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: products, isLoading, error } = useProducts();
  const deleteProduct = useDeleteProduct();

  const handleDelete = (id: string) => {
    deleteProduct.mutate(id);
  };

  return (
    <Layout>
      <section className="container py-12">
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Our Collection
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Curated pieces designed for the modern wardrobe. Quality craftsmanship meets timeless style.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] rounded-sm" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-destructive">Error loading products. Please try again.</p>
          </div>
        ) : (
          <ProductGrid 
            products={products || []} 
            onDelete={handleDelete}
            isDeleting={deleteProduct.isPending}
          />
        )}
      </section>
    </Layout>
  );
};

export default Index;
