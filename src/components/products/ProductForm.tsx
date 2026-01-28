import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Image as ImageIcon, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Product, ProductInsert, ProductUpdate } from "@/lib/supabase";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductInsert | ProductUpdate) => Promise<void>;
  isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    image: initialData?.image || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    if (!formData.description.trim()) {
      toast({ title: "Description is required", variant: "destructive" });
      return;
    }
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      toast({ title: "Valid price is required", variant: "destructive" });
      return;
    }

    await onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      image: formData.image.trim() || null,
    });
  };

  const isComplete = formData.name && formData.description && formData.price;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all group"
      >
        <div className="p-2 rounded-xl bg-muted group-hover:bg-muted/80 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="font-medium">Back</span>
      </button>

      {/* Form Card */}
      <div className="card-glass p-8 md:p-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-border">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
              {initialData ? "Edit Product" : "Create Product"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {initialData ? "Update your product details" : "Add a new item to your collection"}
            </p>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-3">
          <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
            Product Name 
            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">Required</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Cashmere Oversized Sweater"
            className="input-elegant h-14 text-base rounded-xl"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-3">
          <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
            Description
            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">Required</span>
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your product in detail..."
            rows={5}
            className="input-elegant resize-none text-base rounded-xl"
            required
          />
        </div>

        {/* Price */}
        <div className="space-y-3">
          <Label htmlFor="price" className="text-sm font-semibold flex items-center gap-2">
            Price (USD)
            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">Required</span>
          </Label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-lg">$</span>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              className="input-elegant h-14 pl-10 text-lg font-semibold rounded-xl"
              required
            />
          </div>
        </div>

        {/* Image URL */}
        <div className="space-y-3">
          <Label htmlFor="image" className="text-sm font-semibold flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Image URL 
            <span className="text-xs text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="image"
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="input-elegant h-14 text-base rounded-xl"
          />
          
          {/* Image Preview */}
          {formData.image && (
            <div className="mt-4 rounded-2xl overflow-hidden border border-border bg-muted aspect-video max-w-sm relative group">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                <span className="text-sm font-medium text-foreground">Image Preview</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className={`btn-primary flex-1 h-14 text-base ${isComplete ? 'pulse-glow' : ''}`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Check className="w-5 h-5 mr-2" />
          )}
          {initialData ? "Save Changes" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          className="h-14 px-8 rounded-xl border-border hover:bg-muted transition-all"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
