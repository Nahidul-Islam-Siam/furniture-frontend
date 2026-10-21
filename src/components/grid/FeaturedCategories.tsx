import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/gridData';
import { motion } from 'framer-motion';

export const FeaturedCategories = () => {
  return (
    <section id="featured-collections" className="w-full bg-white overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {CATEGORIES.map((cat, index) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              ease: [0.26, 0.54, 0.32, 1],
            }}
          >
            <Link
              to={`/collections/${cat.slug}`}
              className="group relative aspect-square w-full overflow-hidden block bg-neutral-900"
            >
              {/* Image with zoom transition */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Gradient Overlay matching 99grid skrim__overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

              {/* Title with animated underline */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-6 sm:p-8 text-center text-white z-10">
                <h3 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl tracking-wide uppercase">
                  <span className="skrim-underline pb-1">
                    {cat.name}
                  </span>
                </h3>
                <p className="text-xs text-neutral-300 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 mt-1 font-sans">
                  {cat.count}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
