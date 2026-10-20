export const RichTextSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-white border-b border-neutral-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-neutral-900 leading-snug tracking-tight">
          We do work furniture a little bit different.
        </h2>
        <p className="font-sans text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
          That means easy, affordable, and flexible—whether you’re furnishing your home office or your business.
        </p>
      </div>
    </section>
  );
};
