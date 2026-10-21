import { FOOTER_PROMOTIONS } from '../../data/gridData';
import { motion } from 'framer-motion';

export const FooterPromotions = () => {
  return (
    <section className="py-20 sm:py-24 bg-white border-b border-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {FOOTER_PROMOTIONS.map((promo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.8,
                delay: idx * 0.15,
                ease: [0.26, 0.54, 0.32, 1],
              }}
              className="flex flex-col group"
            >
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

              <p className="font-sans text-sm text-neutral-600 leading-relaxed font-light">
                {promo.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
