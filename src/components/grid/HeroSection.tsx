import { Link } from 'react-router-dom';

export const HeroSection = () => {
export const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[660px] md:min-h-[740px] lg:min-h-[820px] flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Background Image matching user banner screenshot */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/hero-banner.jpg"
          alt="GRID Modern Work Furniture"
          className="w-full h-full object-cover object-[center_top] hero-zoom-bg"
          onError={(e) => {
            e.currentTarget.src = 'https://99grid.com/cdn/shop/files/cover-99grid-compressed_1400x.jpg?v=1767697385';
          }}
        />
        {/* Subtle dual gradients: top gradient for header legibility, bottom gradient for hero text depth */}
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
      </div>

      {/* Hero Text Wrap */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white space-y-4 pt-28 sm:pt-36 pb-16">
        
        {/* Title */}
        <div className="overflow-hidden">
          <h1 className="font-sans font-bold text-4xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight leading-[1.1] text-white drop-shadow-md">
            <span className="animation-cropper">
              <span className="animation-contents hero-title-anim">
                Modern Furniture
              </span>
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="overflow-hidden pt-1">
          <p className="font-sans text-sm sm:text-base md:text-lg font-light text-white tracking-[0.2em] uppercase drop-shadow">
            <span className="animation-cropper">
              <span className="animation-contents hero-subtitle-anim">
                FOR A BETTER WAY TO WORK
              </span>
            </span>
          </p>
        </div>

        {/* Single Outline Shop Now Button matching screenshot */}
        <div className="pt-4 hero-cta-anim flex items-center justify-center">
          <Link
            to="/collections"
            className="px-8 py-3 bg-black/25 hover:bg-white hover:text-black text-white font-medium text-sm tracking-wider uppercase transition-all duration-300 border border-white backdrop-blur-[2px]"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

