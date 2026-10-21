import { motion } from 'framer-motion';

export const RichTextSection = () => {
  return (
    <section className="py-20 sm:py-28 bg-white border-b border-neutral-100 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.26, 0.54, 0.32, 1] }}
        className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4"
      >
        <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-neutral-900 leading-snug tracking-tight">
          We do work furniture a little bit different.
        </h2>
        <p className="font-sans text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto font-light">
          That means easy, affordable, and flexible—whether you’re furnishing your home office or your business.
        </p>
      </motion.div>
    </section>
  );
};
