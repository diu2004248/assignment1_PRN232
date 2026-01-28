import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
        {/* Spinner */}
        <div className="relative p-4 rounded-full bg-muted/50 backdrop-blur-sm">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        </div>
      </div>
      {text && (
        <p className="text-muted-foreground text-sm font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
}
