export const VideoSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-white border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          
          {/* Left: YouTube Video Embed */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-black border border-neutral-200">
            <iframe
              src="https://www.youtube.com/embed/zU43s3D8jls"
              title="Hear From Our Customers - GRID Furniture"
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Right: Copy */}
          <div className="space-y-4 text-left">
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
          </div>

        </div>
      </div>
    </section>
  );
};
