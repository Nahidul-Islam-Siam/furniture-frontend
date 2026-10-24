import { COMPANY_LOGOS } from '../../data/gridData';
import { motion } from 'framer-motion';
import { MotionHeading } from './MotionHeading';

export const CompanyLogosSection = () => {
export const CompanyLogosSection = () => {
  return (
    <section className="py-20 bg-neutral-50/70 border-b border-neutral-100 overflow-hidden">
    <section className="py-20 bg-neutral-50/70 border-b border-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <div className="mb-10">
          <MotionHeading
            tag="h2"
            className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900 tracking-tight"
          >
            Trusted By Top Companies
          </MotionHeading>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 items-center justify-items-center">
          {COMPANY_LOGOS.map((company, idx) => (
            <motion.div
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.6,
                delay: idx * 0.05,
                ease: [0.26, 0.54, 0.32, 1],
              }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.6,
                delay: idx * 0.05,
                ease: [0.26, 0.54, 0.32, 1],
              }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="w-full max-w-[160px] h-20 px-4 py-3 bg-white rounded-xl shadow-xs border border-neutral-100 flex items-center justify-center grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-300"
            >
              <img
                src={company.url}
                alt={company.name}
                className="max-h-12 max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
