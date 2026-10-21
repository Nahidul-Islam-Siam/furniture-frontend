import { Truck, RefreshCw, CreditCard } from 'lucide-react';
import { VALUE_PROPOSITIONS } from '../../data/gridData';
import { motion } from 'framer-motion';

export const ValuePropsSection = () => {
  const icons = [
    <Truck className="w-8 h-8 text-neutral-900" />,
    <RefreshCw className="w-8 h-8 text-neutral-900" />,
    <CreditCard className="w-8 h-8 text-neutral-900" />,
  ];

  return (
    <section className="py-20 sm:py-24 bg-white border-b border-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {VALUE_PROPOSITIONS.map((prop, idx) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.7,
                delay: idx * 0.15,
                ease: [0.26, 0.54, 0.32, 1],
              }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-neutral-50/70 border border-neutral-100 transition-shadow hover:shadow-md"
            >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-xs flex items-center justify-center mb-5 border border-neutral-100">
                {icons[idx]}
              </div>

              <h3 className="font-heading font-bold text-xl text-neutral-900 mb-3">
                {prop.title}
              </h3>

              <p className="font-sans text-sm text-neutral-600 leading-relaxed font-light">
                {prop.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
