export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-muted py-20 md:py-28">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-medium uppercase tracking-widest text-accent bg-accent/10 rounded-full">
            New Collection 2026
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-tight">
            Discover Your
            <span className="block text-accent">Perfect Style</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            Curated pieces designed for the modern wardrobe. Quality craftsmanship meets timeless elegance.
          </p>
        </div>
      </div>
    </section>
  );
}
