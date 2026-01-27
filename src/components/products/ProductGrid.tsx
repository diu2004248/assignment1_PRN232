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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-2xl text-muted-foreground">No products yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first product to get started
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
