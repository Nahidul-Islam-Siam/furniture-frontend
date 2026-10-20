export const CenturyBanner: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#111111] text-white text-center relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-neutral-800/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          GRID Furniture
        </span>

        <h2 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl tracking-tight leading-tight">
          For 21st Century
        </h2>

        <p className="font-sans text-base sm:text-xl text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto pt-2">
          We're a furniture brand that carries everything needed to make your house or office look modern with minimal furnitures and boosts up your work energy!
        </p>
      </div>
    </section>
  );
};
