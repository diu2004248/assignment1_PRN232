import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/products/Navbar";
import { LoadingSpinner } from "@/components/products/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

interface CartItemWithProduct {
  id: string;
  product_id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    description: string;
  };
}

const Cart = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('cart_items')
        .select('id, product_id, quantity, products(id, name, price, image, description)')
        .eq('user_id', user!.id);
      if (error) throw error;
      return (data as CartItemWithProduct[]) || [];
    },
    enabled: !!user,
  });

  const updateQty = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      if (quantity <= 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any).from('cart_items').delete().eq('id', id);
        if (error) throw error;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any).from('cart_items').update({ quantity }).eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const removeItem = useMutation({
    mutationFn: async (id: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('cart_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({ title: "Item removed from cart" });
    },
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const total = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-background noise-overlay">
        <Navbar />
        <div className="page-container pt-32 text-center fade-in">
          <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Sign in to view cart</h2>
          <p className="text-muted-foreground mb-8">You need to be logged in to use the cart.</p>
          <Link to="/login" className="btn-primary inline-block">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <Navbar />
      <div className="page-container pt-28 pb-16 md:pt-32 md:pb-24">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-10 slide-up" style={{ fontFamily: 'var(--font-serif)' }}>
          Your Cart
        </h1>

        {isLoading && <LoadingSpinner text="Loading cart..." />}

        {!isLoading && cartItems.length === 0 && (
          <div className="text-center py-20 fade-in">
            <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6 pulse-glow">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Your cart is empty</h3>
            <p className="text-muted-foreground mb-8">Browse our collection and add items you love.</p>
            <Link to="/" className="btn-primary inline-block">Explore Collection</Link>
          </div>
        )}

        {!isLoading && cartItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="card-glass p-4 md:p-6 flex gap-4 md:gap-6 items-center">
                  {/* Image */}
                  <Link to={`/products/${item.product_id}`} className="shrink-0">
                    <div className="w-20 h-24 md:w-24 md:h-32 rounded-xl overflow-hidden bg-muted">
                      {item.products.image ? (
                        <img src={item.products.image} alt={item.products.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product_id}`}>
                      <h3 className="text-lg font-semibold text-foreground truncate hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>
                        {item.products.name}
                      </h3>
                    </Link>
                    <p className="price-tag text-base mt-1">{formatPrice(item.products.price)}</p>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQty.mutate({ id: item.id, quantity: item.quantity - 1 })}
                        className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-foreground font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty.mutate({ id: item.id, quantity: item.quantity + 1 })}
                        className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal & Remove */}
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-foreground">{formatPrice(item.products.price * item.quantity)}</p>
                    <button
                      onClick={() => removeItem.mutate(item.id)}
                      className="mt-2 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card-glass p-6 md:p-8 sticky top-28">
                <h3 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-primary font-medium">Free</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-foreground text-lg font-bold">
                      <span>Total</span>
                      <span className="price-tag">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
