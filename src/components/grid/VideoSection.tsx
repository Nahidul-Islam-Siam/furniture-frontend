import { motion } from 'framer-motion';

export const VideoSection = () => {
  return (
    <section className="py-20 sm:py-24 bg-white border-b border-neutral-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          
          {/* Left: YouTube Video Embed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.26, 0.54, 0.32, 1] }}
            className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-black border border-neutral-200"
          >
            <iframe
              src="https://www.youtube.com/embed/zU43s3D8jls"
              title="Hear From Our Customers - GRID Furniture"
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>

          {/* Right: Copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.26, 0.54, 0.32, 1] }}
            className="space-y-4 text-left"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Customer Stories
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-neutral-900 leading-tight">
              Hear From Our Customers
            </h2>
            <p className="font-sans text-base sm:text-lg text-neutral-600 leading-relaxed font-light">
              Discover how we create beautiful furniture pieces that transform your living space and redefine commercial work environments across Bangladesh.
            </p>
            <div className="pt-2">
              <a
                href="https://www.youtube.com/@gridfurniture5735"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-black underline underline-offset-4"
              >
                Watch more reviews on YouTube →
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
