/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/products/Navbar";
import { LoadingSpinner } from "@/components/products/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, Package } from "lucide-react";

const Checkout = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
       
      const { data, error } = await (supabase as any)
        .from('cart_items')
        .select('id, product_id, quantity, products(id, name, price, image, description)')
        .eq('user_id', user!.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

   
  const total = cartItems.reduce((sum: number, item: any) => sum + item.products.price * item.quantity, 0);

  const placeOrder = async () => {
    if (!user || cartItems.length === 0) return;
    setPlacing(true);
    try {
      // Create order
       
      const { data: order, error: orderError } = await (supabase as any)
        .from('orders')
        .insert({ user_id: user.id, total_amount: total, status: 'paid' })
        .select()
        .single();
      if (orderError) throw orderError;

      // Create order items
       
      const orderItems = cartItems.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.products.name,
        product_price: item.products.price,
        quantity: item.quantity,
      }));
       
      const { error: itemsError } = await (supabase as any).from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // Clear cart
       
      const { error: clearError } = await (supabase as any).from('cart_items').delete().eq('user_id', user.id);
      if (clearError) throw clearError;

      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setOrderPlaced(true);
      toast({ title: "Order placed successfully!" });
     
    } catch (err: any) {
      toast({ title: "Failed to place order", description: err.message, variant: "destructive" });
    }
    setPlacing(false);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background noise-overlay">
        <Navbar />
        <div className="page-container pt-32 text-center fade-in">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6 pulse-glow">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-4xl font-bold mb-3 text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
            Order Confirmed!
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">Thank you for your purchase. Your order is being processed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/orders" className="btn-primary inline-flex items-center gap-2">
              <Package className="w-4 h-4" />
              View Orders
            </Link>
            <Link to="/" className="btn-secondary inline-block">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <Navbar />
      <div className="page-container pt-28 pb-16 md:pt-32 md:pb-24">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-10 slide-up" style={{ fontFamily: 'var(--font-serif)' }}>
          Checkout
        </h1>

        {isLoading && <LoadingSpinner text="Loading..." />}

        {!isLoading && cartItems.length === 0 && (
          <div className="text-center py-20 fade-in">
            <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-serif)' }}>No items to checkout</h3>
            <Link to="/" className="btn-primary inline-block mt-4">Browse Products</Link>
          </div>
        )}

        {!isLoading && cartItems.length > 0 && (
          <div className="max-w-2xl mx-auto fade-in">
            <div className="card-glass p-6 md:p-8">
              <h3 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Order Review</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                    <div className="w-14 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                      {item.products.image ? (
                        <img src={item.products.image} alt={item.products.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-muted-foreground opacity-50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{item.products.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-foreground">{formatPrice(item.products.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span className="price-tag">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                {placing ? "Processing..." : "Confirm & Pay"}
              </button>
              <p className="text-xs text-muted-foreground text-center mt-3">Payment is simulated for demo purposes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
