"use client";

import React from "react";
import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-8">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-medium">Terms of Service</span>
        </div>

        <div className="border-b border-neutral-100 pb-8 mb-8">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-neutral-900">
            Terms of Service
          </h1>
          <p className="text-xs text-neutral-500 mt-2">
            Last Updated: November 2026 • GRID Ventures Ltd.
          </p>
        </div>

        <div className="space-y-8 text-neutral-700 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-neutral-900">
              1. Overview
            </h2>
            <p>
              This website is operated by GRID Ventures Ltd. Throughout the site,
              the terms &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to GRID Furniture.
              By visiting our site and/or purchasing furniture from us, you engage
              in our &ldquo;Service&rdquo; and agree to be bound by the following terms and
              conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-neutral-900">
              2. Products, Pricing & Accuracy
            </h2>
            <p>
              Prices for our products are subject to change without notice. All
              descriptions of products, wood species, and specifications are
              subject to change at any time without notice, at our sole discretion.
              We reserve the right to discontinue any model at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-neutral-900">
              3. Delivery & Assembly
            </h2>
            <p>
              Delivery timeframes inside Dhaka are usually 2 to 4 business days.
              White-glove assembly is provided by GRID specialists at the recipient&apos;s
              premises. Outside Dhaka deliveries are routed through secure,
              heavy-duty crated transport partners.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-neutral-900">
              4. Payment & Security
            </h2>
            <p>
              We accept online payments through SSLCommerz (Credit/Debit Card,
              bKash, Nagad, Rocket, Upay) as well as Cash on Delivery (COD) for
              eligible orders in Dhaka.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-neutral-900">
              5. Governing Law
            </h2>
            <p>
              These Terms of Service and any separate agreements whereby we provide
              you Services shall be governed by and construed in accordance with the
              laws of the People&apos;s Republic of Bangladesh.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
