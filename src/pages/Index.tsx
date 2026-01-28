import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, searchProducts, deleteProduct } from "@/lib/supabase";
import { Navbar } from "@/components/products/Navbar";
import { ProductCard } from "@/components/products/ProductCard";
import { SearchBar } from "@/components/products/SearchBar";
import { DeleteDialog } from "@/components/products/DeleteDialog";
import { LoadingSpinner } from "@/components/products/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { Package, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', searchQuery],
    queryFn: () => searchQuery ? searchProducts(searchQuery) : getProducts(),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Product deleted successfully" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Failed to delete product", variant: "destructive" });
    },
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleDeleteClick = (id: string) => {
    const product = products.find(p => p.id === id);
    setDeleteName(product?.name || "");
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        {/* Animated background glow */}
        <div className="hero-glow" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="page-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">New Collection Available</span>
            </div>
            
            <h1 className="section-title-glow mb-6 slide-up">
              Redefine Your
              <br />
              Style
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 fade-in fade-in-delay-2">
              Discover curated fashion pieces that blend timeless elegance with contemporary design. 
              Crafted for those who dare to stand out.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in fade-in-delay-3">
              <Link to="/products/new" className="btn-primary group">
                <span>Add New Product</span>
                <ArrowRight className="w-4 h-4 inline-block ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#products" className="btn-secondary">
                Explore Collection
              </a>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* Search & Products Section */}
      <section id="products" className="py-16 md:py-24">
        <div className="page-container">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="text-primary font-medium text-sm tracking-widest uppercase mb-2 block">
                Our Collection
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
                All Products
              </h2>
            </div>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Loading State */}
          {isLoading && <LoadingSpinner text="Loading products..." />}

          {/* Error State */}
          {error && (
            <div className="text-center py-16 card-glass p-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-destructive" />
              </div>
              <p className="text-destructive font-medium">Failed to load products. Please try again.</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && products.length === 0 && (
            <div className="text-center py-20 fade-in">
              <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6 pulse-glow">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                {searchQuery ? "No products found" : "No products yet"}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {searchQuery 
                  ? "Try adjusting your search terms or browse all products." 
                  : "Start building your collection by adding your first product."}
              </p>
              {!searchQuery && (
                <Link to="/products/new" className="btn-primary inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Add First Product
                </Link>
              )}
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    product={product}
                    onDelete={handleDeleteClick}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Product Count */}
          {!isLoading && products.length > 0 && (
            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-muted/50 border border-border">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <p className="text-muted-foreground text-sm">
                  Showing <span className="text-foreground font-semibold">{products.length}</span> product{products.length !== 1 ? 's' : ''}
                  {searchQuery && <span> for "<span className="text-primary">{searchQuery}</span>"</span>}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={confirmDelete}
        productName={deleteName}
      />
    </div>
  );
};

export default Index;
