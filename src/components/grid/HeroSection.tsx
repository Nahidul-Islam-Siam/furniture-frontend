"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[660px] md:min-h-[740px] lg:min-h-[820px] flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Background Image matching original banner */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/904244067_1854399275688210_2979974784891532611_n.jpg"
          alt="Modern Work Furniture"
          className="w-full h-full object-cover object-[center_center] hero-zoom-bg"
        />
        {/* Subtle dual gradients: top gradient for header legibility, bottom gradient for hero text depth */}
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
      </div>

      {/* Hero Text Wrap */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white space-y-4 pt-28 sm:pt-36 pb-16">
        {/* Title: Engineering Excellence */}
        <div className="overflow-hidden">
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight leading-[1.1] text-white drop-shadow-md">
            <span className="animation-cropper">
              <span className="animation-contents hero-title-anim inline-block">
                Engineering <span className="text-[#0088ff] drop-shadow-[0_2px_12px_rgba(0,136,255,0.4)]">Excellence</span>
              </span>
            </span>
          </h1>
        </div>

        {/* Subtitle: ── Crafted with Precision ── */}
        <div className="overflow-hidden pt-1">
          <div className="animation-cropper">
            <div className="animation-contents hero-subtitle-anim flex items-center justify-center gap-3 sm:gap-4">
              <span className="h-[1.5px] w-8 sm:w-16 bg-white/70 rounded-full" />
              <p className="font-heading text-base sm:text-xl md:text-2xl font-semibold text-white tracking-wide drop-shadow m-0">
                Crafted with Precision
              </p>
              <span className="h-[1.5px] w-8 sm:w-16 bg-white/70 rounded-full" />
            </div>
          </div>
        </div>

        {/* Solid Blue Pill Shop Now Button */}
        <div className="pt-6 hero-cta-anim flex items-center justify-center">
          <Link
            href="/collections"
            className="group inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#0055b3] hover:bg-[#004499] text-white border-2 border-white/80 font-heading text-sm sm:text-base font-bold tracking-wide shadow-[0_8px_30px_rgba(0,85,179,0.55)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.99] no-underline hover:no-underline"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Bottom fade into white background */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
