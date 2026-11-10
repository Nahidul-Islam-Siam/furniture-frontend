"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface AuthCardShellProps {
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
}

/**
 * Shared floating card layout for authentication pages (/login, /signup),
 * featuring a pastel atmospheric canvas, organic curved header banner,
 * and an overlapping crisp white rounded form sheet.
 */
export const AuthCardShell: React.FC<AuthCardShellProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-[#dce7f1] relative overflow-hidden font-sans">
      {/* Subtle organic atmospheric background waves */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 w-[620px] h-[620px] rounded-full bg-[#eaf1f7]/70 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 w-[560px] h-[560px] rounded-full bg-[#c9daea]/65 blur-2xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] rounded-[32px] bg-white shadow-[0_24px_65px_-12px_rgba(15,23,42,0.14)] overflow-hidden relative z-10"
      >
        {/* Top Organic Illustrated Header */}
        <div className="relative bg-[#e3714b] pt-9 pb-14 px-8 text-center overflow-hidden">
          {/* Left golden ochre organic curve */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 -bottom-6 w-36 h-36 rounded-full bg-[#d8b75a]/90"
          />
          {/* Right sage/mint organic curve */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -bottom-10 w-40 h-32 rounded-[45%] bg-[#63c393]/90 -rotate-12"
          />
          {/* Subtle top-right soft highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 right-6 w-32 h-32 rounded-full bg-white/10 blur-xl"
          />

          <div className="relative z-10 flex flex-col items-center">
            <Link
              href="/"
              aria-label="Unique Engineering & Furniture Home"
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 shadow-sm no-underline hover:bg-white transition-colors"
            >
              <Image
                src="/images/uef-emblem.png"
                alt="UEF"
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-slate-900">
                Unique Engineering
              </span>
            </Link>

            <h1 className="text-[26px] sm:text-[28px] font-bold tracking-tight text-white leading-[1.18] font-heading">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-xs font-medium text-white/90">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Overlapping White Rounded Form Sheet */}
        <div className="bg-white rounded-t-[32px] -mt-7 relative z-10 px-7 sm:px-9 pt-8 pb-8">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthCardShell;
