import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();
  
  const navLinks = [
    { href: "/", label: "Shop" },
    { href: "/products/new", label: "Add Product" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-18 items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3 transition-all hover:opacity-80 group">
          <div className="relative">
            <ShoppingBag className="h-7 w-7 text-accent transition-transform group-hover:scale-110" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-accent animate-pulse" />
          </div>
          <span className="font-display text-2xl font-semibold tracking-tight">
            ATELIER
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-all duration-200",
                location.pathname === link.href
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
              {location.pathname === link.href && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
              )}
            </Link>
          ))}
          <Link to="/products/new">
            <Button size="sm" className="ml-3 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-all">
              <Plus className="h-4 w-4" />
              New Product
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
