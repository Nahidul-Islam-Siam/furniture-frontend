import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Award, Sparkles, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full bg-white font-sans">
      {/* Hero */}
      <section className="py-20 sm:py-24 bg-neutral-900 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            About GRID Furniture
          </span>
          <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight">
            Redefining Modern Workspaces in Bangladesh
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            We founded GRID to make it effortless for individuals and high-growth companies across Bangladesh to furnish workspaces that inspire productivity and physical well-being.
          </p>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900">
              Contract-Grade Quality Direct to You
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Traditional commercial furniture in Bangladesh was either exorbitantly overpriced through layers of importers or lacked the ergonomic engineering required for 10+ hour creative and tech workdays.
            </p>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              We sell directly to our customers. By eliminating middlemen and showrooms markups, our collection costs half as much as premium furniture of comparable quality, backed by up to 5 years of local servicing warranty.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-neutral-100 aspect-[4/3]">
            <img
              src="https://99grid.com/cdn/shop/files/unnamed_600x.jpg?v=1652694957"
              alt="GRID Workspace"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2.5">
            <Sparkles className="w-6 h-6 text-neutral-900" />
            <h3 className="font-heading font-bold text-base text-neutral-900">Ergonomic First</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every chair and motorized desk is engineered to alleviate spinal pressure and improve posture.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2.5">
            <Truck className="w-6 h-6 text-neutral-900" />
            <h3 className="font-heading font-bold text-base text-neutral-900">Free Dhaka Assembly</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We don't just drop off boxes. Our technicians assemble and calibrate your desk inside your room.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2.5">
            <ShieldCheck className="w-6 h-6 text-neutral-900" />
            <h3 className="font-heading font-bold text-base text-neutral-900">Up to 5 Years Warranty</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Hassle-free pickup and doorstep servicing. Genuine parts and manufacturer support guaranteed.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2.5">
            <Award className="w-6 h-6 text-neutral-900" />
            <h3 className="font-heading font-bold text-base text-neutral-900">Trusted By Leaders</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Equipping startups, agencies, multinationals, and home creators throughout Bangladesh.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black hover:bg-neutral-800 text-white text-sm font-semibold rounded-full shadow-lg transition-all"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
