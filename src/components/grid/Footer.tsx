"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { UEFLogo } from "../ui/UEFLogo";

const COMPANY_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Collections", href: "/collections" },
  { label: "About Us", href: "/about" },
  { label: "Design Journal", href: "/blog" },
];

const COLLECTION_LINKS = [
  { label: "Gaming Desks", href: "/collections/table" },
  { label: "Executive Tables", href: "/collections/table" },
  { label: "Ergonomic Chairs", href: "/collections/chair" },
  { label: "Slotted Racks", href: "/collections/storage" },
];

const SUPPORT_LINKS = [
  { label: "Track Order", href: "/dashboard/orders" },
  { label: "Custom Fabrication", href: "/contact" },
  { label: "5-Year Warranty", href: "/warranty" },
  { label: "Refund Policy", href: "/policies/refund-policy" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/policies/privacy-policy" },
  { label: "Terms of Service", href: "/policies/terms-of-service" },
  { label: "Warranty", href: "/warranty" },
  { label: "Refund Policy", href: "/policies/refund-policy" },
];

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = email.trim();
    if (!cleaned || isSubscribing) return;

    setIsSubscribing(true);
    await new Promise((r) => setTimeout(r, 350));
    toast.success("Subscribed! You'll receive updates on new collections & offers.");
    setEmail("");
    setSubscribed(true);
    setIsSubscribing(false);
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="relative bg-gradient-to-b from-white via-[#f3f6fe] to-[#eef3fe] pt-10 sm:pt-14 font-sans">
      {/* Floating Cobalt Newsletter Banner (Overlaps into the white footer card below) */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[22px] sm:rounded-[26px] bg-gradient-to-r from-[#346ef3] via-[#3268eb] to-[#2c5de0] shadow-[0_24px_55px_-14px_rgba(37,99,235,0.4)] px-6 py-7 sm:px-10 sm:py-9 lg:px-12 lg:py-10 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 lg:gap-10">
            {/* Left: Seamless 3D Furniture Scene */}
            <div className="md:col-span-5 flex items-center justify-center">
              <div className="relative w-56 h-48 sm:w-64 sm:h-52 lg:w-72 lg:h-56 select-none">
                <Image
                  src="/images/footer-desk-chair.jpg"
                  alt="Unique Engineering Ergonomic Chair & Steel Desk"
                  fill
                  sizes="(max-width: 768px) 224px, 288px"
                  className="object-contain [mask-image:radial-gradient(closest-side,black_70%,transparent_98%)]"
                />
              </div>
            </div>

            {/* Right: Headline, Frosted Glass Pill Input & Policy Note */}
            <div className="md:col-span-7 text-center md:text-left space-y-3">
              <h3 className="font-heading font-bold text-xl sm:text-2xl lg:text-[26px] text-white leading-snug tracking-tight m-0">
                Subscribe to our newsletter to get updates on our latest collections
              </h3>
              <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed m-0">
                Get exclusive updates on custom CNC furniture, new launches &amp; factory offers.
              </p>

              <form onSubmit={handleSubscribe} className="pt-1.5 max-w-md mx-auto md:mx-0">
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Email address
                </label>
                <div className="flex items-center rounded-full bg-white/15 border border-white/25 p-1.5 backdrop-blur-sm focus-within:bg-white/20 focus-within:border-white/50 transition-all">
                  <Mail
                    className="w-4 h-4 text-white/75 ml-3 shrink-0"
                    aria-hidden="true"
                  />
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isSubscribing}
                    className="w-full min-w-0 bg-transparent border-0 px-3 py-2 text-xs sm:text-sm text-white placeholder:text-white/75 focus:outline-none disabled:opacity-70"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="shrink-0 h-9 sm:h-10 px-4 sm:px-6 rounded-full bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-900 text-xs sm:text-[13px] font-semibold shadow-sm flex items-center justify-center gap-1.5 border-0 cursor-pointer transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSubscribing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                        <span>Sending</span>
                      </>
                    ) : subscribed ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                        <span>Joined</span>
                      </>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>
              </form>

              <p className="text-[11px] text-white/75 leading-relaxed pt-0.5 m-0">
                You will be able to unsubscribe at any time. Read our{" "}
                <Link
                  href="/policies/privacy-policy"
                  className="text-white font-medium underline underline-offset-2 hover:text-white/90"
                >
                  privacy policy here
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main White Footer Card (Overlapped by the Floating Blue Banner) */}
      <div className="relative z-10 -mt-20 sm:-mt-24 pt-32 sm:pt-36 bg-white border-t border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-x-6 gap-y-9 lg:gap-8 pb-12">
            {/* Brand + Circular Social Icons (full row on mobile/tablet, 4 cols on desktop) */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-4 flex flex-col sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-start lg:justify-start gap-4 pb-6 sm:pb-8 lg:pb-0 border-b border-slate-100 lg:border-b-0 lg:pr-6">
              <div className="space-y-3">
                <Link href="/" className="inline-block no-underline hover:opacity-90 transition-opacity">
                  <UEFLogo size="md" variant="dark" showText={true} />
                </Link>

                <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed max-w-[290px] m-0">
                  Precision CNC laser cutting and custom steel-wood furniture manufactured in our own factory with nationwide delivery.
                </p>
              </div>

              {/* Circular Dark Social Icons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href="https://www.facebook.com/uniqueengineeringfurniture"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Follow on Facebook (8.7K+)"
                  aria-label="Unique Engineering Facebook Page"
                  className="h-9 w-9 rounded-full bg-slate-900 hover:bg-[#346ef3] text-white flex items-center justify-center no-underline transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
                <a
                  href="https://wa.me/8801755348053"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp"
                  aria-label="Unique Engineering WhatsApp"
                  className="h-9 w-9 rounded-full bg-slate-900 hover:bg-emerald-600 text-white flex items-center justify-center no-underline transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
                <a
                  href="mailto:info@uniqueengineeringbd.com"
                  title="Email us"
                  aria-label="Email Unique Engineering"
                  className="h-9 w-9 rounded-full bg-slate-900 hover:bg-[#346ef3] text-white flex items-center justify-center no-underline transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Company */}
            <div className="col-span-1 lg:col-span-2 space-y-3.5">
              <h4 className="font-heading font-semibold text-sm text-slate-900 m-0">
                Company
              </h4>
              <ul role="list" className="m-0 p-0 list-none space-y-2.5 text-xs sm:text-[13px]">
                {COMPANY_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-slate-500 hover:text-slate-900 transition-colors no-underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Collections */}
            <div className="col-span-1 lg:col-span-2 space-y-3.5">
              <h4 className="font-heading font-semibold text-sm text-slate-900 m-0">
                Collections
              </h4>
              <ul role="list" className="m-0 p-0 list-none space-y-2.5 text-xs sm:text-[13px]">
                {COLLECTION_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-slate-500 hover:text-slate-900 transition-colors no-underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="col-span-1 lg:col-span-2 space-y-3.5">
              <h4 className="font-heading font-semibold text-sm text-slate-900 m-0">
                Support
              </h4>
              <ul role="list" className="m-0 p-0 list-none space-y-2.5 text-xs sm:text-[13px]">
                {SUPPORT_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-slate-500 hover:text-slate-900 transition-colors no-underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div className="col-span-1 lg:col-span-2 space-y-3.5">
              <h4 className="font-heading font-semibold text-sm text-slate-900 m-0">
                Contact Us
              </h4>
              <div className="space-y-3 text-xs sm:text-[13px]">
                <a
                  href="tel:01755348053"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 no-underline transition-colors"
                >
                  <Phone
                    className="w-3.5 h-3.5 text-[#346ef3] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap">+880 1755-348053</span>
                </a>
                <a
                  href="mailto:info@uniqueengineeringbd.com"
                  className="flex items-start gap-2 text-slate-600 hover:text-slate-900 no-underline transition-colors break-all"
                >
                  <Mail
                    className="w-3.5 h-3.5 text-[#346ef3] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>info@uniqueengineeringbd.com</span>
                </a>
                <div className="flex items-start gap-2 text-slate-500">
                  <MapPin
                    className="w-3.5 h-3.5 text-[#346ef3] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Legal Strip */}
          <div className="border-t border-slate-100 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="text-center sm:text-left">
              © Copyright 2026 Unique Engineering &amp; Furniture. All rights reserved.
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5">
              {LEGAL_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-slate-500 hover:text-slate-900 transition-colors no-underline"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
