"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Package, Home, Printer, ShieldCheck } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "N/A";
  const method = (searchParams.get("method") || "").toLowerCase();
  const isCod = method === "cod";
  const isManual =
    method.includes("manual") ||
    method.includes("bkash") ||
    method.includes("nagad") ||
    method.includes("rocket");

  const methodLabel = isCod
    ? "Cash on Delivery"
    : isManual
    ? "Mobile Banking (bKash/Nagad)"
    : "Online Payment (SSLCommerz)";

  return (
    <div className="max-w-lg w-full bg-white rounded-3xl border border-neutral-100 shadow-xl p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-11 h-11" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
          {methodLabel}
        </span>
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-neutral-900 tracking-tight">
          Order Confirmed!
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-sm mx-auto">
          {isCod
            ? "Your order has been placed successfully. You can pay with cash upon receiving and inspecting your furniture."
            : isManual
            ? "Your transaction details and TrxID have been recorded! Our accounts team will verify your transfer and schedule factory dispatch."
            : "Your payment was processed successfully through SSLCommerz."}
        </p>
      </div>

      <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-1">
        <div className="text-xs text-neutral-500 font-medium">Order Reference</div>
        <div className="font-heading font-black text-xl text-neutral-900 font-mono tracking-wider">
          #{orderNumber}
        </div>
        <div className="text-[11px] text-neutral-400">
          A confirmation receipt has been generated for your records.
        </div>
      </div>

      <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 text-left text-xs text-neutral-600 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-neutral-800">
          <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
          Factory Dispatch &amp; Quality Guarantee
        </div>
        <p className="text-[11px] text-neutral-500 leading-relaxed">
          Our logistics manager will call you within 24 hours to confirm delivery schedule, floor elevation assistance, and white-glove assembly.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-full transition flex items-center justify-center gap-1.5 border border-neutral-200"
        >
          <Printer className="w-3.5 h-3.5" /> Print Receipt
        </button>
        <Link
          href="/dashboard/orders"
          className="flex-1 py-3 px-4 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Package className="w-3.5 h-3.5" /> View My Orders
        </Link>
        <Link
          href="/collections"
          className="flex-1 py-3 px-4 border border-neutral-200 text-neutral-800 text-xs font-bold rounded-full hover:border-black transition flex items-center justify-center gap-1.5"
        >
          <Home className="w-3.5 h-3.5" /> Continue Shopping
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

