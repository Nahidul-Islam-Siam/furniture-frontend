import { useState } from 'react';
import { TESTIMONIALS } from '../../data/gridData';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-20 sm:py-24 bg-neutral-50/60 border-b border-neutral-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Title */}
        <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-2">
          Don't take our word for it
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 font-sans mb-10">
          Trusted by Bangladesh's top entrepreneurs, tech creators & executives
        </p>

        {/* Carousel Card */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-neutral-100 max-w-3xl mx-auto min-h-[300px] flex flex-col justify-between">
          
          <div className="space-y-6">
            {/* 5 Stars */}
            <div className="flex items-center justify-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="font-sans text-lg sm:text-2xl text-neutral-800 font-normal leading-relaxed italic max-w-2xl mx-auto">
              "{current.quote}"
            </blockquote>
          </div>

          {/* Author Details with Avatar */}
          <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-center gap-4">
            <img
              src={current.avatar}
              alt={current.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-neutral-100 shadow-sm"
              onError={(e) => {
                // fallback initials
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="text-left">
              <h4 className="font-heading font-bold text-base text-neutral-900">
                {current.name}
              </h4>
              <p className="font-sans text-xs sm:text-sm text-neutral-500">
                {current.role}, {current.company}
              </p>
            </div>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center justify-between absolute inset-y-1/2 -inset-x-5 sm:-inset-x-6 pointer-events-none">
            <button
              onClick={prev}
              className="pointer-events-auto p-3 rounded-full bg-white shadow-lg border border-neutral-200 text-neutral-700 hover:text-black hover:scale-105 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="pointer-events-auto p-3 rounded-full bg-white shadow-lg border border-neutral-200 text-neutral-700 hover:text-black hover:scale-105 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? 'w-8 bg-neutral-900' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
