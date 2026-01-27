import { Product } from "@/lib/supabase";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function ProductGrid({ products, onDelete, isDeleting }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
          <span className="font-display text-3xl text-muted-foreground/50">✨</span>
        </div>
        <p className="font-display text-3xl text-foreground">No products found</p>
        <p className="mt-3 text-muted-foreground max-w-sm">
          Start building your collection by adding your first product
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <div 
          key={product.id} 
          style={{ animationDelay: `${index * 50}ms` }}
          className="animate-slide-up opacity-0"
        >
          <ProductCard 
            product={product} 
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        </div>
      ))}
    </div>
  );
}
