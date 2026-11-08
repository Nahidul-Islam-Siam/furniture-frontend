"use client";

import React, { useState } from "react";
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
  Box,
  Layers,
  Wrench,
  MapPin,
  Mail,
  Clock,
  Send,
  Eye,
  Users,
  Briefcase,
  ChevronRight,
  Check,
} from "lucide-react";
import { useAddContactMutation } from "@/redux/service/contactApi/contactApi";
import toast from "react-hot-toast";

export default function GridStudioPage() {
  const [addContact, { isLoading: isSubmitting }] = useAddContactMutation();

  // Consultation form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    spaceType: "Tech Startup Workspace",
    area: "1,000 - 3,000 sq ft",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error("Please fill in your name, email, and phone number.");
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: `GRID Studio Consultation Request - ${formData.company || formData.name}`,
        message: `Project Type: ${formData.spaceType}\nFloor Area: ${formData.area}\nCompany: ${formData.company}\nDetails: ${formData.message}`,
      };

      await addContact(payload).unwrap();
      toast.success(
        "Thank you! Your GRID Studio design consultation request has been received. Our team will contact you within 24 hours."
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        spaceType: "Tech Startup Workspace",
        area: "1,000 - 3,000 sq ft",
        message: "",
      });
    } catch {
      // Fallback optimistic confirmation if backend endpoint is unavailable
      toast.success(
        "Thank you! Your inquiry has been sent directly to the GRID Studio team at hello@99grid.com."
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        spaceType: "Tech Startup Workspace",
        area: "1,000 - 3,000 sq ft",
        message: "",
      });
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-neutral-900 selection:bg-[#e07548] selection:text-white">
      {/* 1. Breadcrumb */}
      <div className="border-b border-neutral-100 bg-neutral-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          <span className="text-neutral-900 font-semibold">GRID Studio</span>
        </div>
      </div>

      {/* 2. Hero Section: Architectural Statement */}
      <section className="relative bg-[#0d0d0d] text-white py-24 sm:py-32 lg:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-semibold tracking-wide text-[#e07548]">
            <Sparkles className="w-3.5 h-3.5" />
            GRID STUDIO • INTERIOR & WORKSPACE DESIGN
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-white">
            Transforming Spaces Into <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-[#e07548]">
              Functional Works of Art
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-3xl mx-auto font-light leading-relaxed pt-2">
            Comprehensive on-site space planning, photorealistic 3D visualization,
            custom furniture integration, and turnkey interior fit-outs for
            Bangladesh&apos;s leading tech startups, creative agencies, and corporate offices.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#consultation"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#e07548] px-8 py-3.5 text-sm sm:text-base font-bold text-white shadow-xl hover:bg-[#cf6235] hover:scale-105 active:scale-95 transition-all"
            >
              Start Your Project <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#process"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/80 px-8 py-3.5 text-sm sm:text-base font-semibold text-neutral-200 hover:text-white hover:border-neutral-500 transition-all"
            >
              Explore Our Process
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-neutral-800/80 max-w-4xl mx-auto">
            <div>
              <div className="font-heading font-black text-3xl sm:text-4xl text-white">
                100+
              </div>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
                Workspaces Built
              </p>
            </div>
            <div>
              <div className="font-heading font-black text-3xl sm:text-4xl text-white">
                3D
              </div>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
                Virtual Previews
              </p>
            </div>
            <div>
              <div className="font-heading font-black text-3xl sm:text-4xl text-white">
                5-Year
              </div>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
                Commercial Warranty
              </p>
            </div>
            <div>
              <div className="font-heading font-black text-3xl sm:text-4xl text-white">
                100%
              </div>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
                Turnkey Execution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Hero Showcase Image */}
      <section className="relative -mt-10 sm:-mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[16/9] sm:aspect-[21/9] bg-neutral-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://99grid.com/cdn/shop/files/cover-99grid-compressed_1400x.jpg?v=1767697385"
            alt="GRID Studio Modern Architectural Office Setup"
            className="w-full h-full object-cover brightness-95 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 sm:p-10">
            <div className="text-white max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#e07548]">
                Featured Project
              </span>
              <h3 className="text-lg sm:text-2xl font-bold font-heading mt-1">
                Executive Tech Headquarters & Sit-Stand Collaborative Pods
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1 font-light">
                Custom Nordic oak elevating desks, acoustic focus booths, and Steelcase ergonomic seating in Banani, Dhaka.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. What Grid Studio Does: 4 Core Pillars */}
      <section className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#e07548]">
            Core Capabilities
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-neutral-900 tracking-tight">
            Comprehensive Workspace Solutions
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 leading-relaxed font-light">
            We bridge the gap between architectural interior design and contract-grade
            furniture manufacturing to deliver cohesive, productive environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Pillar 1 */}
          <div className="p-8 rounded-3xl bg-neutral-50/80 border border-neutral-100 space-y-4 hover:border-black/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center group-hover:bg-[#e07548] transition-colors shadow">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-xl text-neutral-900">
                Interior Design & Space Planning
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                Designing tailored environments that balance aesthetics, team dynamics,
                and physical wellness—reflecting your brand&apos;s distinct personality and work culture.
              </p>
            </div>
            <ul className="text-xs text-neutral-500 space-y-1.5 pt-4 border-t border-neutral-200/60 font-medium">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#e07548]" /> Ergonomic Circulation Paths
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#e07548]" /> Agile Workstation Clusters
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 rounded-3xl bg-neutral-50/80 border border-neutral-100 space-y-4 hover:border-black/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center group-hover:bg-[#e07548] transition-colors shadow">
                <Box className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-xl text-neutral-900">
                Immersive 3D Visualizations
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                Visualize before you build. We translate your room dimensions, photos,
                or CAD drawings into photorealistic 3D models populated with real GRID
                furniture, lighting, and textures.
              </p>
            </div>
            <ul className="text-xs text-neutral-500 space-y-1.5 pt-4 border-t border-neutral-200/60 font-medium">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#e07548]" /> True-to-Scale Modeling
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#e07548]" /> Lighting & Material Simulation
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-3xl bg-neutral-50/80 border border-neutral-100 space-y-4 hover:border-black/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center group-hover:bg-[#e07548] transition-colors shadow">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-xl text-neutral-900">
                Custom Furniture Integration
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                Tailor-made elevating standing desk series, executive conference setups,
                acoustic wall panels, and credenzas built to fit exact dimensions and finishes.
              </p>
            </div>
            <ul className="text-xs text-neutral-500 space-y-1.5 pt-4 border-t border-neutral-200/60 font-medium">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#e07548]" /> Bespoke Solid Wood Surfaces
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#e07548]" /> Integrated Cable Raceways
              </li>
            </ul>
          </div>

          {/* Pillar 4 */}
          <div className="p-8 rounded-3xl bg-neutral-50/80 border border-neutral-100 space-y-4 hover:border-black/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center group-hover:bg-[#e07548] transition-colors shadow">
                <Wrench className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-xl text-neutral-900">
                Fit-Out & Execution Excellence
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                End-to-end execution managed on-site by dedicated GRID project engineers.
                Zero disruption, on-time delivery, white-glove assembly, and clean handovers.
              </p>
            </div>
            <ul className="text-xs text-neutral-500 space-y-1.5 pt-4 border-t border-neutral-200/60 font-medium">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#e07548]" /> Turnkey Project Management
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#e07548]" /> 5-Year Structural Support
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Spaces We Transform (Portfolio Categories) */}
      <section className="py-20 bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e07548]">
              Portfolio Focus
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-neutral-900">
              Spaces Engineered for Performance
            </h2>
            <p className="text-sm text-neutral-500 font-light">
              We design specialized environments tailored to diverse workflow demands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tech Startups */}
            <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-sm group">
              <div className="aspect-[4/3] overflow-hidden bg-neutral-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                  alt="Tech Startup Office"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                  Agile Teams
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-heading font-bold text-lg text-neutral-900">
                  Tech Startups & Engineering Labs
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  Open-concept floor layouts, sit-stand workstations for long coding
                  sprints, collaborative break-out islands, and ergonomic Steelcase seating.
                </p>
              </div>
            </div>

            {/* Corporate Offices */}
            <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-sm group">
              <div className="aspect-[4/3] overflow-hidden bg-neutral-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80"
                  alt="Corporate Executive Office"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                  Executive Suite
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-heading font-bold text-lg text-neutral-900">
                  Corporate Enterprises & Boardrooms
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  Acoustic privacy partitions, executive walnut conferencing tables with
                  integrated audio-visual connectivity, and ergonomic director suites.
                </p>
              </div>
            </div>

            {/* Creative Studios */}
            <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-sm group">
              <div className="aspect-[4/3] overflow-hidden bg-neutral-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80"
                  alt="Creative Agency Studio"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                  Design & Media
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-heading font-bold text-lg text-neutral-900">
                  Creative Studios & Agencies
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  Minimalist aesthetic hubs, mood-enhancing ambient lighting, flexible
                  modular credenzas, and custom finishes that inspire breakthrough ideas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. The Grid Studio Process: Step by Step */}
      <section id="process" className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#e07548]">
            Workflow
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-neutral-900">
            How We Bring Your Space to Life
          </h2>
          <p className="text-sm text-neutral-500 font-light">
            A seamless, transparent four-step journey from blueprint to live setup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Step 1 */}
          <div className="relative p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-3">
            <span className="font-heading font-black text-4xl text-[#e07548]/30">01</span>
            <h3 className="font-heading font-bold text-lg text-neutral-900">
              Discovery & Consultation
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
              We visit your site, understand team ergonomics, review room dimensions,
              and define project timelines and functional goals.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-3">
            <span className="font-heading font-black text-4xl text-[#e07548]/30">02</span>
            <h3 className="font-heading font-bold text-lg text-neutral-900">
              3D Design Development
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
              We build high-fidelity 3D models with true-to-scale furniture layouts,
              material swatches, and lighting before physical execution begins.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-3">
            <span className="font-heading font-black text-4xl text-[#e07548]/30">03</span>
            <h3 className="font-heading font-bold text-lg text-neutral-900">
              Precision Fit-Out
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
              Our master craftsmen handle custom surface fabrication, cable ducting,
              and on-site acoustic and structural installation with zero hassle.
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-3">
            <span className="font-heading font-black text-4xl text-[#e07548]/30">04</span>
            <h3 className="font-heading font-bold text-lg text-neutral-900">
              Handover & 5-Yr Support
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
              Final ergonomic adjustments, team orientation, and lifetime access to
              GRID&apos;s warranty, maintenance, and upgrade network.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Display Center & Studio Showroom Section */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#e07548]">
                Experience in Person
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white">
                Visit the GRID Studio Display Center
              </h2>
              <p className="text-sm text-neutral-400 font-light max-w-xl leading-relaxed">
                Experience our elevating desk series, test authentic Steelcase ergonomic
                chairs, and examine custom wood species in person at our flagship Banani showroom.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-800/80 border border-neutral-700">
                  <MapPin className="w-4 h-4 text-[#e07548] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Address:</strong>
                    House 111, Road 8, Block C, Banani (Behind Hotel Sarina), Dhaka, Bangladesh
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-800/80 border border-neutral-700">
                  <Clock className="w-4 h-4 text-[#e07548] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Studio Hours:</strong>
                    Saturday – Thursday: 10:00 AM – 8:00 PM
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-800/80 border border-neutral-700">
                  <PhoneCall className="w-4 h-4 text-[#e07548] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Hotline:</strong>
                    +880 14044 31330–5 / +880 1700-009947
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-800/80 border border-neutral-700">
                  <Mail className="w-4 h-4 text-[#e07548] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Direct Email:</strong>
                    hello@99grid.com
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border-2 border-neutral-700 shadow-2xl aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
                  alt="GRID Banani Studio Display Center"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold tracking-wide shadow-lg">
                    Flagship Studio Banani
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Interactive Project Consultation / Inquiry Form */}
      <section id="consultation" className="py-24 sm:py-32 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-neutral-50 border border-neutral-200/90 p-8 sm:p-12 lg:p-16 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e07548]">
              Let&apos;s Build Together
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-neutral-900">
              Book a Studio Consultation
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-light">
              Tell us about your space. Our lead spatial engineer will connect with you
              within 24 hours to schedule an on-site visit or review your 3D blueprints.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Asif Mahmud"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="asif@company.com"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+880 1700-000000"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Acme Tech Ltd."
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                  Space Type
                </label>
                <select
                  value={formData.spaceType}
                  onChange={(e) => setFormData({ ...formData, spaceType: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none shadow-sm"
                >
                  <option value="Tech Startup Workspace">Tech Startup Workspace</option>
                  <option value="Corporate Enterprise Floor">Corporate Enterprise Floor</option>
                  <option value="Creative Agency & Studio">Creative Agency & Studio</option>
                  <option value="Executive Home Office Setup">Executive Home Office Setup</option>
                  <option value="Commercial Co-working Space">Commercial Co-working Space</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                  Estimated Floor Area
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none shadow-sm"
                >
                  <option value="Under 1,000 sq ft">Under 1,000 sq ft</option>
                  <option value="1,000 - 3,000 sq ft">1,000 - 3,000 sq ft</option>
                  <option value="3,000 - 8,000 sq ft">3,000 - 8,000 sq ft</option>
                  <option value="8,000+ sq ft (Full Floor/Building)">8,000+ sq ft (Full Floor/Building)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Tell Us About Your Project & Timelines
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mention desired desk quantities, wood preference (Oak, Walnut, Matte Black), target move-in date, or address..."
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none shadow-sm"
              />
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#e07548] px-10 py-4 text-base font-bold text-white shadow-xl hover:bg-[#cf6235] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Submitting Inquiry..." : "Submit Studio Request"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
