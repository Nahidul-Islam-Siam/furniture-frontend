import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/gridData';

export const FeaturedCategories: React.FC = () => {
  return (
    <section id="featured-collections" className="w-full bg-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            to={`/collections/${cat.slug}`}
            className="group relative aspect-square w-full overflow-hidden block bg-neutral-900"
          >
            {/* Image */}
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlay matching 99grid */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/85" />

            {/* Title with animated underline */}
            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center text-white z-10">
              <h3 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl tracking-wide relative pb-1">
                {cat.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
              </h3>
              <p className="text-xs text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 font-sans">
                {cat.count}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
