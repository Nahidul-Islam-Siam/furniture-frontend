"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ShoppingBag, ArrowLeft } from "lucide-react";

function CancelContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "";

  return (
    <div className="max-w-md w-full bg-white rounded-2xl border border-neutral-100 shadow-xl p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
          Transaction Cancelled
        </span>
        <h1 className="text-3xl font-heading font-black text-neutral-900 tracking-tight">
          Payment Cancelled
        </h1>
        <p className="text-sm text-neutral-600">
          You cancelled the payment session before completing the transaction.
        </p>
      </div>

      {orderNumber && (
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 space-y-1">
          <div className="text-xs text-neutral-500">Order ID</div>
          <div className="font-heading font-bold text-lg text-neutral-900">
            #{orderNumber}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/collections"
          className="flex-1 py-3 px-4 bg-black text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-neutral-50/50">
      <Suspense fallback={<div className="text-sm text-neutral-500">Loading details...</div>}>
        <CancelContent />
      </Suspense>
    </div>
  );
}

