"use client";

import React from "react";
import { Check, Clock, Wrench, Truck, PackageCheck, XCircle } from "lucide-react";

interface OrderProgressStepperProps {
  status: string;
}

const STEPS = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "processing", label: "CNC Fabrication", icon: Wrench },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: PackageCheck },
];

export const OrderProgressStepper: React.FC<OrderProgressStepperProps> = ({
  status,
}) => {
  const normalized = (status || "pending").toLowerCase();

  if (normalized === "cancelled") {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
        <XCircle className="h-4 w-4 shrink-0" />
        <span>This order was cancelled. Contact +880 1755-348053 if you need assistance.</span>
      </div>
    );
  }

  const effectiveKey = normalized === "confirmed" ? "processing" : normalized;
  const currentIndex = Math.max(
    0,
    STEPS.findIndex((s) => s.key === effectiveKey)
  );

  return (
    <div className="w-full py-2">
      <div className="grid grid-cols-4 gap-2 relative">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isActive = index <= currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center text-center relative">
              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className={`hidden sm:block absolute top-4 left-1/2 w-full h-0.5 -z-0 ${
                    index < currentIndex ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                  isCompleted
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : isCurrent
                    ? "border-cyan-600 bg-cyan-50 text-cyan-700"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
              </div>

              <span
                className={`mt-1.5 text-[11px] leading-tight font-semibold ${
                  isActive ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderProgressStepper;
