"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw, ChevronRight } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-8">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-medium">Refund & Replacement Policy</span>
        </div>

        <div className="border-b border-neutral-100 pb-8 mb-8">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-neutral-900">
            Refund & Replacement Policy
          </h1>
          <p className="text-xs text-neutral-500 mt-2">
            Last Updated: November 2026 • GRID Ventures Ltd.
          </p>
        </div>

        <div className="space-y-8 text-neutral-700 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-neutral-900">
              7-Day Defect Replacement
            </h2>
            <p>
              If your furniture arrives damaged or exhibits any manufacturing defects
              during our technician&apos;s white-glove installation, we will immediately
              replace the affected component or entire unit at zero additional cost.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-neutral-900">
              Refund Processing
            </h2>
            <p>
              Once your return request is inspected and approved, your refund will be
              processed back to your original payment method (SSLCommerz, bKash, or
              bank transfer) within 7 to 10 working days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
