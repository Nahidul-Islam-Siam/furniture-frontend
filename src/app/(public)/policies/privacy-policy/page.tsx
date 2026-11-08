"use client";

import React from "react";
import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-8">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-medium">Privacy Policy</span>
        </div>

        <div className="border-b border-neutral-100 pb-8 mb-8">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-neutral-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-500 mt-2">
            Last Updated: November 2026 • GRID Ventures Ltd.
          </p>
        </div>

        <div className="space-y-8 text-neutral-700 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-neutral-900">
              Information We Collect
            </h2>
            <p>
              When you purchase something from our store, as part of the buying and
              selling process, we collect the personal information you give us such
              as your name, address, phone number, and email address for order
              fulfillment, assembly scheduling, and warranty records.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-neutral-900">
              Payment Security
            </h2>
            <p>
              All online payments are encrypted through SSLCommerz and adhere to
              PCI-DSS requirements. GRID does not store your credit card or mobile
              financial PIN numbers on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-neutral-900">
              Contact Information
            </h2>
            <p>
              If you have any questions regarding your personal information, please
              contact our privacy officer at info@99grid.com or call +880 1700-009947.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
