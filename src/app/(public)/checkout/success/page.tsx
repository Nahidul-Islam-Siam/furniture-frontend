"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Package, Home } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "N/A";

  return (
    <div className="max-w-md w-full bg-white rounded-2xl border border-neutral-100 shadow-xl p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Payment Succeeded
        </span>
        <h1 className="text-3xl font-heading font-black text-neutral-900 tracking-tight">
          Thank You!
        </h1>
        <p className="text-sm text-neutral-600">
          Your payment via SSLCommerz was processed successfully.
        </p>
      </div>

      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 space-y-1">
        <div className="text-xs text-neutral-500">Order Reference</div>
        <div className="font-heading font-bold text-lg text-neutral-900">
          #{orderNumber}
        </div>
      </div>

      <p className="text-xs text-neutral-500 leading-relaxed">
        Our customer executive will reach out to you within 24 hours to schedule your delivery & ergonomic furniture assembly.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/dashboard"
          className="flex-1 py-3 px-4 bg-black text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
        >
          <Package className="w-4 h-4" /> Track in Dashboard
        </Link>
        <Link
          href="/collections"
          className="flex-1 py-3 px-4 border border-neutral-200 text-neutral-800 text-xs font-semibold rounded-full hover:border-black transition-colors flex items-center justify-center gap-1.5"
        >
          <Home className="w-4 h-4" /> Continue Store
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-neutral-50/50">
      <Suspense fallback={<div className="text-sm text-neutral-500">Loading order details...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}

