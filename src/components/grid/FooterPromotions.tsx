import { FOOTER_PROMOTIONS } from '../../data/gridData';

export const FooterPromotions: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {FOOTER_PROMOTIONS.map((promo, idx) => (
            <div key={idx} className="flex flex-col group">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-100 mb-6 border border-neutral-100">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              <h3 className="font-heading font-bold text-xl text-neutral-900 mb-3 group-hover:text-black transition-colors leading-snug">
                {promo.title}
              </h3>

              <p className="font-sans text-sm text-neutral-600 leading-relaxed font-normal">
                {promo.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
