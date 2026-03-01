/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/products/Navbar";
import { LoadingSpinner } from "@/components/products/LoadingSpinner";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, Calendar, CheckCircle, Clock } from "lucide-react";

const Orders = () => {
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('orders')
        .select('*, order_items(*, products(id, name, image))')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const statusIcon = (status: string) => {
    if (status === 'paid') return <CheckCircle className="w-4 h-4 text-primary" />;
    return <Clock className="w-4 h-4 text-accent" />;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background noise-overlay">
        <Navbar />
        <div className="page-container pt-32 text-center fade-in">
          <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Sign in to view orders</h2>
          <Link to="/login" className="btn-primary inline-block mt-4">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <Navbar />
      <div className="page-container pt-28 pb-16 md:pt-32 md:pb-24">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-10 slide-up" style={{ fontFamily: 'var(--font-serif)' }}>
          Order History
        </h1>

        {isLoading && <LoadingSpinner text="Loading orders..." />}

        {!isLoading && orders.length === 0 && (
          <div className="text-center py-20 fade-in">
            <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-serif)' }}>No orders yet</h3>
            <p className="text-muted-foreground mb-8">Start shopping to see your order history here.</p>
            <Link to="/" className="btn-primary inline-block">Explore Collection</Link>
          </div>
        )}

        {!isLoading && orders.length > 0 && (
          <div className="space-y-6 fade-in max-w-3xl">
            {orders.map((order: any) => (
              <div key={order.id} className="card-glass p-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    {statusIcon(order.status)}
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(order.created_at)}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                        {item.products?.image ? (
                          <img src={item.products.image} alt={item.product_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4 text-muted-foreground opacity-50" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.product_price)}</p>
                      </div>
                      <p className="text-sm font-bold text-foreground">{formatPrice(item.product_price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between pt-4 border-t border-border">
                  <span className="font-medium text-muted-foreground">Total</span>
                  <span className="price-tag text-lg">{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
