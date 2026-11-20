"use client";

import React, { useState } from "react";
import { X, Send, Sparkles, MessageCircle, HelpCircle } from "lucide-react";

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const WHATSAPP_PHONE = "8801755348053";

  const handleOpenWhatsApp = (customMessage?: string) => {
    const text = customMessage || "Hello Unique Engineering & Furniture! I would like to inquire about your custom furniture and CNC laser cutting services.";
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 font-sans">
      {/* Interactive Chat Popup Card */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[320px] sm:w-[350px] bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative size-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <span className="font-heading font-black text-white text-sm">UEF</span>
                <span className="absolute bottom-0 right-0 size-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight text-white">Unique Engineering</h4>
                <p className="text-[11px] text-emerald-200">Online • Typically replies in minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
              title="Close chat"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#E5DDD5]/30 space-y-3">
            {/* Incoming Welcome Bubble */}
            <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-2xs border border-neutral-100 max-w-[90%] space-y-1">
              <span className="text-[11px] font-bold text-[#075E54] block">Customer Support</span>
              <p className="text-xs text-neutral-800 leading-relaxed">
                Hello! 👋 Welcome to Unique Engineering &amp; Furniture. How can we help you today?
              </p>
              <span className="text-[9px] text-neutral-400 block text-right">Just now</span>
            </div>

            {/* Quick Question Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                Quick Inquiries:
              </span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp("Hello, I need a custom quote for furniture / CNC laser cutting.")}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-neutral-200 text-xs text-neutral-800 font-medium transition shadow-2xs flex items-center justify-between group"
                >
                  <span>💬 Custom furniture or CNC quote</span>
                  <Send className="size-3 text-neutral-400 group-hover:text-emerald-600 transition" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp("Hello, I would like to check on my delivery and order status.")}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-neutral-200 text-xs text-neutral-800 font-medium transition shadow-2xs flex items-center justify-between group"
                >
                  <span>🚚 Order delivery &amp; tracking</span>
                  <Send className="size-3 text-neutral-400 group-hover:text-emerald-600 transition" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp("Hello, I would like to inquire about ergonomic chairs and desks.")}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-neutral-200 text-xs text-neutral-800 font-medium transition shadow-2xs flex items-center justify-between group"
                >
                  <span>🪑 Inquire about chairs &amp; desks</span>
                  <Send className="size-3 text-neutral-400 group-hover:text-emerald-600 transition" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-3 bg-white border-t border-neutral-100">
            <button
              type="button"
              onClick={() => handleOpenWhatsApp()}
              className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition active:scale-[0.99]"
            >
              <span>Chat on WhatsApp Directly</span>
              <Send className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="WhatsApp Helpline and Support"
        title="Chat on WhatsApp"
        className="relative flex items-center gap-2.5 p-3.5 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba59] hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white cursor-pointer select-none group"
      >
        {/* Pulsing Green Online Indicator */}
        <span className="absolute -top-1 -right-1 flex size-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full size-3.5 bg-emerald-500 border-2 border-white" />
        </span>

        {/* WhatsApp Official Vector Icon */}
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="currentColor"
          className="size-6 text-white shrink-0"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>

        {/* Hover / Expand Pill */}
        <span className="hidden sm:inline-block max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold text-white tracking-wide">
          Chat on WhatsApp
        </span>
      </button>
    </div>
  );
}

export default WhatsAppWidget;

