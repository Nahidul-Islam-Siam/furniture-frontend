import { useState } from 'react';
import { TESTIMONIALS } from '../../data/gridData';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MotionHeading } from './MotionHeading';

export const TestimonialsSection = () => {
export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [direction, setDirection] = useState(1);

  const prev = () => {
    setDirection(-1);
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const next = () => {
    setDirection(1);
    setDirection(1);
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-20 sm:py-24 bg-neutral-50/60 border-b border-neutral-100 overflow-hidden">
    <section className="py-20 sm:py-24 bg-neutral-50/60 border-b border-neutral-100 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Title with MotionHeading */}
        <div className="mb-10">
          <MotionHeading
            tag="h2"
            className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-2"
          >
            Don't take our word for it
          </MotionHeading>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.26, 0.54, 0.32, 1] }}
            className="text-xs sm:text-sm text-neutral-500 font-sans"
          >
            Trusted by Bangladesh's top entrepreneurs, tech creators & executives
          </motion.p>
        </div>

        {/* Carousel Card with Smooth Slide Animations */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-neutral-100 max-w-3xl mx-auto min-h-[300px] flex flex-col justify-between overflow-hidden">
        {/* Carousel Card with Smooth Slide Animations */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-neutral-100 max-w-3xl mx-auto min-h-[300px] flex flex-col justify-between overflow-hidden">
          
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              transition={{ duration: 0.45, ease: [0.26, 0.54, 0.32, 1] }}
              className="space-y-6"
            >
              {/* 5 Stars */}
              <div className="flex items-center justify-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              transition={{ duration: 0.45, ease: [0.26, 0.54, 0.32, 1] }}
              className="space-y-6"
            >
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
              {/* Quote */}
              <blockquote className="font-sans text-lg sm:text-2xl text-neutral-800 font-normal leading-relaxed italic max-w-2xl mx-auto">
                "{current.quote}"
              </blockquote>

              {/* Author Details with Avatar */}
              <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-center gap-4">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-neutral-100 shadow-sm"
                  onError={(e) => {
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
            </motion.div>
          </AnimatePresence>
              {/* Author Details with Avatar */}
              <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-center gap-4">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-neutral-100 shadow-sm"
                  onError={(e) => {
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
            </motion.div>
          </AnimatePresence>

          {/* Carousel Arrows */}
          <div className="flex items-center justify-between absolute inset-y-1/2 -inset-x-5 sm:-inset-x-6 pointer-events-none">
            <button
              onClick={prev}
              className="pointer-events-auto p-3 rounded-full bg-white shadow-lg border border-neutral-200 text-neutral-700 hover:text-black hover:scale-105 transition-all active:scale-95"
              className="pointer-events-auto p-3 rounded-full bg-white shadow-lg border border-neutral-200 text-neutral-700 hover:text-black hover:scale-105 transition-all active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="pointer-events-auto p-3 rounded-full bg-white shadow-lg border border-neutral-200 text-neutral-700 hover:text-black hover:scale-105 transition-all active:scale-95"
              className="pointer-events-auto p-3 rounded-full bg-white shadow-lg border border-neutral-200 text-neutral-700 hover:text-black hover:scale-105 transition-all active:scale-95"
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
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
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
