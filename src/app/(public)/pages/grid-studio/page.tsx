"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  Layout,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";

export default function GridStudioPage() {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero Banner */}
      <section className="relative bg-neutral-900 text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#e07548_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative max-w-4xl mx-auto text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider text-[#e07548] border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> Bespoke Workspace Solutions
          </span>
          <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight">
            GRID Studio
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Tailor-made workstations, ergonomic office architecture, and custom
            elevating desk configurations designed exclusively for Bangladesh&apos;s
            fastest growing companies and modern creators.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-neutral-900 shadow hover:bg-neutral-100 transition"
            >
              Book Studio Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-800/80 px-7 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition"
            >
              Explore Ready Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            What We Do
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-neutral-900">
            From Blueprint to White-Glove Installation
          </h2>
          <p className="text-sm text-neutral-500 max-w-2xl mx-auto">
            We work directly with architects, facility managers, and founders to
            deliver turnkey office ergonomics across Dhaka and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-neutral-900">
              Custom Space Planning
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              We analyze your floor plan, acoustic requirements, and team sizes
              to create 3D renders that maximize movement, focus, and collaboration.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              <Layout className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-neutral-900">
              Custom Table Dimensions & Tops
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Choose from Nordic oak, American walnut, seamless black matte, or
              marble textures, custom-cut to your room dimensions with integrated
              cable ducts.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-neutral-900">
              Corporate Bulk Orders & Warranty
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Equip entire floors with volume-tier discounts, 5-year commercial
              warranties, and dedicated on-site servicing throughout Bangladesh.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-heading font-black text-2xl sm:text-3xl">
              Ready to Upgrade Your Workspace?
            </h3>
            <p className="text-sm text-neutral-400 font-light">
              Talk directly with a GRID workspace engineer today.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-neutral-900 shadow hover:bg-neutral-100 transition shrink-0"
          >
            <PhoneCall className="w-4 h-4" /> Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
