"use client";

import { useState } from "react";
import Link from "next/link";
import { Facebook, Phone, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { UEFLogo } from "../ui/UEFLogo";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thank you for subscribing to Unique Engineering updates!");
    setEmail("");
  };

  return (
    <footer className="bg-[#0b1322] text-neutral-300 pt-16 pb-12 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-16 border-b border-slate-800">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <Link href="/" className="inline-block no-underline">
              <UEFLogo size="md" variant="white" showText={true} />
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              CNC লেজার কাটিং এর মাধ্যমে সুনিপুণ মেটাল ডিজাইন। ১০০% কোয়ালিটি নিশ্চয়তার সাথে কাস্টম সাইজে প্রস্তুত করা হয়, নিজস্ব কারখানায় তৈরি করে সারা দেশে সরবরাহ করা হয়।
            </p>

            {/* Social & Contact Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/uniqueengineeringfurniture"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold no-underline transition-colors"
                title="Follow UEF on Facebook (8.7K+ Followers)"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook Page (8.7K)</span>
              </a>
              <a
                href="https://wa.me/8801755348053"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-white text-base tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-normal">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors no-underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-cyan-400 transition-colors no-underline">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors no-underline">
                  About Unique Engineering
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400 transition-colors no-underline">
                  Custom Size Order &amp; Contact
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy-policy" className="hover:text-cyan-400 transition-colors no-underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms-of-service" className="hover:text-cyan-400 transition-colors no-underline">
                  Terms &amp; Warranty
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Product Collections */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-white text-base tracking-wide">
              Specialized Products
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-normal">
              <li>
                <Link href="/collections/table" className="hover:text-cyan-400 transition-colors no-underline">
                  Gaming Desks &amp; Workstations
                </Link>
              </li>
              <li>
                <Link href="/collections/table" className="hover:text-cyan-400 transition-colors no-underline">
                  CNC Laser Cut Metal Desks
                </Link>
              </li>
              <li>
                <Link href="/collections/table" className="hover:text-cyan-400 transition-colors no-underline">
                  Executive Office Tables
                </Link>
              </li>
              <li>
                <Link href="/collections/storage" className="hover:text-cyan-400 transition-colors no-underline">
                  Slotted Metal Racks &amp; Channels
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400 transition-colors no-underline">
                  Custom Laser-Cut Gates &amp; Panels
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400 transition-colors no-underline">
                  Electrical Panel Enclosures
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Factory Hotline & Direct Order */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-white text-base tracking-wide">
              Factory &amp; Hotline
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              সরাসরি কল বা WhatsApp-এ ড্রয়িং পাঠিয়ে আপনার কাস্টম সাইজের অর্ডার কনফার্ম করতে পারেন।
            </p>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Phone className="w-4 h-4" />
                <a href="tel:01755348053" className="text-white hover:text-cyan-300 no-underline">
                  01755-348053
                </a>
              </div>
              <div className="text-[11px] text-slate-400">
                Direct WhatsApp &amp; Call (সকাল ৯টা - রাত ৯টা)
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-full text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-full flex items-center justify-center transition-colors"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment icons */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Unique Engineering &amp; Furniture (UEF) • All rights reserved.
          </div>

          {/* Supported payment badges */}
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-[11px]">
              Cash on Delivery (COD)
            </span>
            <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-[11px]">
              bKash
            </span>
            <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-[11px]">
              Nagad
            </span>
            <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-[11px]">
              Bank Transfer
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
