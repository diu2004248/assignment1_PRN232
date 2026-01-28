import { Link } from "react-router-dom";
import { Edit2, Trash2, ExternalLink, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/supabase";

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <article className="group card-elevated gradient-border">
      {/* Image Container */}
      <Link to={`/products/${product.id}`} className="block aspect-[3/4] overflow-hidden relative">
        {product.image ? (
          <>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground gap-3">
            <ShoppingBag className="w-12 h-12 opacity-50" />
            <span className="text-xs uppercase tracking-widest">No Image</span>
          </div>
        )}
        
        {/* Quick Actions - Show on hover */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <Link
            to={`/products/${product.id}/edit`}
            className="p-3 rounded-xl bg-background/90 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg"
            title="Edit product"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(product.id);
            }}
            className="p-3 rounded-xl bg-background/90 backdrop-blur-sm text-foreground hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 shadow-lg"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* View Details Button - Show on hover */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
          <Link
            to={`/products/${product.id}`}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:scale-[1.02]"
          >
            <span>View Details</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 md:p-6">
        <Link to={`/products/${product.id}`} className="block group/title">
          <h3 className="product-name line-clamp-1 transition-colors group-hover/title:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2 mb-4 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="price-tag text-xl">{formatPrice(product.price)}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">In Stock</span>
        </div>
      </div>
    </article>
  );
}
