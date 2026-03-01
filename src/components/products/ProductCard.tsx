import { Link } from "react-router-dom";
import { Edit2, Trash2, ExternalLink, ShoppingBag, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/supabase";

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please sign in to add items to cart", variant: "destructive" });
      return;
    }
    try {
      // Upsert: if already in cart, increment quantity
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existing } = await (supabase as any)
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .maybeSingle();

      if (existing) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('cart_items').update({ quantity: existing.quantity + 1 }).eq('id', existing.id);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('cart_items').insert({ user_id: user.id, product_id: product.id, quantity: 1 });
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart-count'] });
      toast({ title: `${product.name} added to cart` });
    } catch {
      toast({ title: "Failed to add to cart", variant: "destructive" });
    }
  };

  return (
    <article className="group card-elevated gradient-border">
      <Link to={`/products/${product.id}`} className="block aspect-[3/4] overflow-hidden relative">
        {product.image ? (
          <>
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground gap-3">
            <ShoppingBag className="w-12 h-12 opacity-50" />
            <span className="text-xs uppercase tracking-widest">No Image</span>
          </div>
        )}
        
        {/* Quick Actions - Only for logged in users */}
        {user && (
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <Link
              to={`/products/${product.id}/edit`}
              className="p-3 rounded-xl bg-background/90 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg"
              title="Edit product"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            <button
              onClick={(e) => { e.preventDefault(); onDelete(product.id); }}
              className="p-3 rounded-xl bg-background/90 backdrop-blur-sm text-foreground hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 shadow-lg"
              title="Delete product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Add to Cart & View Details on hover */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75 flex gap-2">
          <button
            onClick={addToCart}
            className="flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:scale-[1.02]"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </Link>

      <div className="p-5 md:p-6">
        <Link to={`/products/${product.id}`} className="block group/title">
          <h3 className="product-name line-clamp-1 transition-colors group-hover/title:text-primary">{product.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2 mb-4 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="price-tag text-xl">{formatPrice(product.price)}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">In Stock</span>
        </div>
      </div>
    </article>
  );
}
