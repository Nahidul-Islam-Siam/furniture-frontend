import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { MotionHeading } from './MotionHeading';

export const MeaningfulDesignSection = () => {
export const MeaningfulDesignSection = () => {
  return (
    <section className="py-20 sm:py-24 bg-white border-b border-neutral-100 overflow-hidden">
    <section className="py-20 sm:py-24 bg-white border-b border-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: High-resolution brand product image with zoom & fade entrance */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.26, 0.54, 0.32, 1] }}
            className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-neutral-100 border border-neutral-200 group"
          >
          {/* Left: High-resolution brand product image with zoom & fade entrance */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.26, 0.54, 0.32, 1] }}
            className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-neutral-100 border border-neutral-200 group"
          >
            <img
              src="https://99grid.com/cdn/shop/files/unnamed_600x.jpg?v=1652694957"
              alt="We Create Meaningful Design - GRID Furniture"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white text-xs font-medium tracking-widest uppercase bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full">
            <div className="absolute bottom-6 left-6 text-white text-xs font-medium tracking-widest uppercase bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full">
              Engineered Quality Control
            </div>
          </motion.div>
          </motion.div>

          {/* Right: Authenticity & Quality Assurance copy */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.26, 0.54, 0.32, 1] }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                Direct Importer & Manufacturer
              </span>
              <MotionHeading
                tag="h2"
                className="font-heading font-black text-3xl sm:text-4xl text-neutral-900 leading-tight"
              >
                We Create Meaningful Design
              </MotionHeading>
              <p className="font-sans text-base text-neutral-600 leading-relaxed pt-2 font-light">
                GRID ensures you 100% authenticity and originality of the products which are imported via China, Vietnam & Taiwan. We never want you to compromise with the quality that is why we ensure you get the best furniture delivered via GRID!
              </p>
            </div>

            {/* 3 Numbered Value Points */}
            <div className="space-y-4 pt-2">
              <div className="flex gap-3.5">
                <div className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  1
                </div>
                <p className="font-sans text-sm text-neutral-700 leading-relaxed font-light">
                <p className="font-sans text-sm text-neutral-700 leading-relaxed font-light">
                  We assure you 100% premium quality of our products and before the delivery of each product, we have 4 product experts who do the quality check while the product is ready for delivery.
                </p>
              </div>

              <div className="flex gap-3.5">
                <div className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  2
                </div>
                <p className="font-sans text-sm text-neutral-700 leading-relaxed font-light">
                <p className="font-sans text-sm text-neutral-700 leading-relaxed font-light">
                  At GRID, we deliver you premium quality and stylish design which also delivers the meaning of elegance at your home and workstation.
                </p>
              </div>

              <div className="flex gap-3.5">
                <div className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  3
                </div>
                <p className="font-sans text-sm text-neutral-700 leading-relaxed font-light">
                <p className="font-sans text-sm text-neutral-700 leading-relaxed font-light">
                  Our products are made of strong materials imported from China which ensure 100% durability and contract-grade life cycle.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 px-9 py-4 bg-black hover:bg-neutral-800 text-white text-sm font-semibold rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
                className="inline-flex items-center gap-2 px-9 py-4 bg-black hover:bg-neutral-800 text-white text-sm font-semibold rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
