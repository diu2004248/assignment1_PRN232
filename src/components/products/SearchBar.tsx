import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search products..." }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, onSearch]);

  return (
    <div className={`relative max-w-sm w-full transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
      <div className={`absolute inset-0 rounded-2xl bg-primary/20 blur-xl transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />
      <div className="relative">
        <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-muted-foreground'}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-14 pr-12 py-4 input-elegant rounded-2xl text-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
