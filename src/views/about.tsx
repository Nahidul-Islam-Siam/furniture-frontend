import Link from 'next/link';
import { ShieldCheck, Truck, Award, Sparkles, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full bg-white font-sans">
      {/* Hero */}
      <section className="py-20 sm:py-24 bg-neutral-900 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            About Unique Engineering &amp; Furniture
          </span>
          <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight">
            Precision CNC Laser Cutting &amp; Metal Furniture
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Engineered in our dedicated factory with 100% quality guarantee. We create bespoke gaming setups, industrial metal racks, and modern furniture delivered safely across Bangladesh.
          </p>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900">
              Direct Factory Manufacturing &amp; Custom Sizing
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              At Unique Engineering &amp; Furniture, we combine high-precision CNC laser cutting technology with heavy-duty metal fabrication. Every cut, weld, and powder coating finish is performed in-house under strict quality supervision.
            </p>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              By manufacturing directly in our own workshop, we deliver custom-tailored dimensions, reinforced steel structures, and premium aesthetics at honest direct factory prices without middleman markups.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-neutral-100 aspect-[4/3]">
            <img
              src="https://99grid.com/cdn/shop/files/unnamed_600x.jpg?v=1652694957"
              alt="Unique Engineering & Furniture Factory"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2.5">
            <Sparkles className="w-6 h-6 text-neutral-900" />
            <h3 className="font-heading font-bold text-base text-neutral-900">CNC Precision</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Millimeter-level laser cutting for intricate patterns, perforated metal grills, and custom brackets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2.5">
            <Truck className="w-6 h-6 text-neutral-900" />
            <h3 className="font-heading font-bold text-base text-neutral-900">Nationwide Delivery</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Carefully wrapped and delivered safely to your doorstep across all 64 districts in Bangladesh.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2.5">
            <ShieldCheck className="w-6 h-6 text-neutral-900" />
            <h3 className="font-heading font-bold text-base text-neutral-900">5-Year Structural Frame</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Solid steel construction backed by our long-term structural integrity and servicing guarantee.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2.5">
            <Award className="w-6 h-6 text-neutral-900" />
            <h3 className="font-heading font-bold text-base text-neutral-900">100% Custom Sizing</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Share your room dimensions or custom drawings via WhatsApp for custom tailored fabrication.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/collections"
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
