import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { Product } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function ProductCard({ product, onDelete, isDeleting }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  return (
    <article className="group animate-fade-in">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-display text-4xl text-muted-foreground/30">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="mt-4 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/products/${product.id}`}>
            <h3 className="font-display text-lg font-medium leading-tight transition-colors hover:text-muted-foreground">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Link to={`/products/${product.id}/edit`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Product</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{product.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(product.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {product.description}
        </p>
        <p className="font-medium">{formattedPrice}</p>
      </div>
    </article>
  );
}
