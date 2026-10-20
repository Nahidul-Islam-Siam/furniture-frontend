import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-[550px] sm:h-[650px] md:h-[720px] flex items-center justify-center overflow-hidden bg-neutral-900">
      {/* Background Image with motion overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://99grid.com/cdn/shop/files/cover-99grid-compressed_1400x.jpg?v=1767697385"
          alt="GRID Modern Work Furniture"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Gradient and dark contrast overlays matching 99grid's Motion theme */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white space-y-6">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium tracking-widest uppercase mb-2">
          Contract-Grade Commercial Furniture BD
        </div>

        <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] text-white drop-shadow-md">
          Modern Furniture
        </h1>

        <p className="font-sans text-lg sm:text-2xl md:text-3xl font-light text-neutral-200 tracking-wide max-w-2xl mx-auto drop-shadow">
          For a better way to work
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/collections"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-neutral-100 text-black font-semibold text-base rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#featured-collections"
            className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/10 text-white font-medium text-base rounded-full border border-white/30 backdrop-blur-sm transition-all"
          >
            Explore Collections
          </a>
        </div>
      </div>
    </section>
  );
};
