import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProductGrid } from "@/components/products/ProductGrid";
import { HeroSection } from "@/components/products/HeroSection";
import { SearchBar } from "@/components/products/SearchBar";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: products, isLoading, error } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = (id: string) => {
    deleteProduct.mutate(id);
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery.trim()) return products;
    
    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  return (
    <Layout>
      <HeroSection />
      
      <section className="container py-12 md:py-16">
        {/* Search Section */}
        <div className="mb-12 animate-slide-up">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          {searchQuery && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"} found for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Section Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Our Collection
            </h2>
            <p className="mt-2 text-muted-foreground">
              {products?.length || 0} products available
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-destructive">Error loading products. Please try again.</p>
          </div>
        ) : (
          <ProductGrid 
            products={filteredProducts} 
            onDelete={handleDelete}
            isDeleting={deleteProduct.isPending}
          />
        )}
      </section>
    </Layout>
  );
};

export default Index;
