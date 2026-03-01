import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Plus, Menu, X, ShoppingCart, LogOut, User, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: cartCount = 0 } = useQuery({
    queryKey: ['cart-count', user?.id],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user!.id);
      if (error) return 0;
      return data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    },
    enabled: !!user,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { path: "/", label: "Collection" },
    ...(user ? [{ path: "/orders", label: "Orders" }] : []),
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg" 
          : "bg-transparent"
      )}
    >
      <nav className="page-container">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl group-hover:bg-primary/30 transition-all duration-300" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            <span className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              ATELIER
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn("nav-link", location.pathname === item.path && "nav-link-active")}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <>
                <Link to="/cart" className="relative p-3 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/products/new" className="btn-primary flex items-center gap-2 !py-3 !px-5">
                  <Plus className="w-4 h-4" />
                  <span>New Product</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-3 rounded-xl bg-muted text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
            {!user && (
              <>
                <Link to="/login" className="btn-secondary !py-3 !px-5 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary flex items-center gap-2 !py-3 !px-5">
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-border fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-medium transition-all",
                    location.pathname === item.path 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Cart {cartCount > 0 && `(${cartCount})`}
                  </Link>
                  <Link to="/products/new" onClick={() => setIsMenuOpen(false)} className="btn-primary flex items-center justify-center gap-2 mt-2">
                    <Plus className="w-4 h-4" /> New Product
                  </Link>
                  <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="px-4 py-3 rounded-xl text-base font-medium text-destructive hover:bg-destructive/10 flex items-center gap-2 mt-1">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              )}
              {!user && (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-secondary text-center mt-2">Sign In</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-primary text-center mt-2">Create Account</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
