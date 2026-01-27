import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();
  
  const navLinks = [
    { href: "/", label: "Shop" },
    { href: "/products/new", label: "Add Product" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <ShoppingBag className="h-6 w-6 text-foreground" />
          <span className="font-display text-xl font-semibold tracking-tight">
            ATELIER
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                location.pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/products/new">
            <Button size="sm" className="ml-2 gap-2">
              <Plus className="h-4 w-4" />
              New Product
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
