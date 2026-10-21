import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[550px] sm:h-[650px] md:h-[720px] flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Background Image with slow zoom-fade from Motion theme */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://99grid.com/cdn/shop/files/cover-99grid-compressed_1400x.jpg?v=1767697385"
          alt="GRID Modern Work Furniture"
          className="w-full h-full object-cover object-[80%_50%] hero-zoom-bg"
        />
        {/* Dual gradients matching 99grid .hero__image-wrapper:after */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />
      </div>

      {/* Hero Text Wrap with Motion Cropper & Rise-Up Animation */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white space-y-5">
        
        {/* Subtle pill tag */}
        <div className="hero-cta-anim inline-block">
          <span className="px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium tracking-widest uppercase">
            Commercial Furniture Bangladesh
          </span>
        </div>

        {/* Title with cropper reveal */}
        <div className="overflow-hidden">
          <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.08] text-white drop-shadow-md">
            <span className="animation-cropper">
              <span className="animation-contents hero-title-anim">
                Modern Furniture
              </span>
            </span>
          </h1>
        </div>

        {/* Subtitle with cropper reveal */}
        <div className="overflow-hidden pt-1">
          <p className="font-sans text-lg sm:text-2xl md:text-3xl font-light text-neutral-200 tracking-wider uppercase drop-shadow">
            <span className="animation-cropper">
              <span className="animation-contents hero-subtitle-anim">
                For a better way to work
              </span>
            </span>
          </p>
        </div>

        {/* CTA Button with fade-in */}
        <div className="pt-5 hero-cta-anim flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/collections"
            className="w-full sm:w-auto px-9 py-4 bg-white hover:bg-neutral-100 text-black font-bold text-sm tracking-widest uppercase rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#featured-collections"
            className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold text-sm tracking-widest uppercase rounded-full border border-white/40 backdrop-blur-sm transition-all"
          >
            Explore Collections
          </a>
        </div>
      </div>
    </section>
  );
};
