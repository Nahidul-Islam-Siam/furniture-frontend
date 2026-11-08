"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, RefreshCw, ShoppingBag } from "lucide-react";

function FailContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "";

  return (
    <div className="max-w-md w-full bg-white rounded-2xl border border-neutral-100 shadow-xl p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
        <XCircle className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
          Payment Incomplete
        </span>
        <h1 className="text-3xl font-heading font-black text-neutral-900 tracking-tight">
          Payment Failed
        </h1>
        <p className="text-sm text-neutral-600">
          The transaction could not be completed by the bank or gateway.
        </p>
      </div>

      {orderNumber && (
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 space-y-1">
          <div className="text-xs text-neutral-500">Saved Order Number</div>
          <div className="font-heading font-bold text-lg text-neutral-900">
            #{orderNumber}
          </div>
          <p className="text-[11px] text-neutral-400">
            Your items are saved. You can choose Cash on Delivery or retry online payment.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/collections"
          className="flex-1 py-3 px-4 bg-black text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" /> Return to Store
        </Link>
        <Link
          href="/contact"
          className="flex-1 py-3 px-4 border border-neutral-200 text-neutral-800 text-xs font-semibold rounded-full hover:border-black transition-colors flex items-center justify-center gap-1.5"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutFailPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-neutral-50/50">
      <Suspense fallback={<div className="text-sm text-neutral-500">Loading details...</div>}>
        <FailContent />
      </Suspense>
    </div>
  );
}

