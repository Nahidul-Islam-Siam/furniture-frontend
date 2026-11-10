"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthCardShell } from "@/components/auth/AuthCardShell";
import Seo from "../components/Seo";
import { useForgotPasswordMutation } from "@/redux/service/auth/authApi";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
type Inputs = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(schema) });

  const inputBaseClass =
    "w-full h-12 px-4 rounded-2xl bg-[#f2f4f7] hover:bg-[#ebeff3] focus:bg-white focus:ring-2 focus:ring-slate-900/10 border border-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 disabled:opacity-60";

  const onSubmit = async (data: Inputs) => {
    setErrorMessage(null);
    const normalizedEmail = data.email.trim().toLowerCase();
    try {
      await forgotPassword({ email: normalizedEmail }).unwrap();
      setSentEmail(normalizedEmail);
      setSent(true);
      toast.success("Reset link sent! Check your email.");
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Failed to send reset email.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <>
      <Seo
        title="Forgot Password | Unique Engineering & Furniture"
        description="Reset your Unique Engineering & Furniture account password."
      />
      <AuthCardShell
        title={
          <>
            Forgot
            <br />
            password?
          </>
        }
        subtitle="We'll send a reset link to your email"
      >
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-4 flex flex-col items-center gap-4 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Email sent!</p>
              <p className="text-xs text-slate-500 mt-1">
                We sent a password reset link to
              </p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                {sentEmail}
              </p>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setErrorMessage(null);
                }}
                className="text-slate-600 underline hover:text-slate-900 bg-transparent border-0 cursor-pointer"
              >
                try again
              </button>
              .
            </p>
          </motion.div>
        ) : (
          <>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200/70 text-red-600 text-xs text-center"
              >
                {errorMessage}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Your account email"
                    autoComplete="email"
                    disabled={isLoading}
                    className={cn(
                      inputBaseClass,
                      "pl-10",
                      errors.email && "bg-red-50/70 ring-2 ring-red-400/50"
                    )}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-[11px] mt-1 pl-2">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-full bg-[#0a0d14] hover:bg-[#1b2232] active:scale-[0.99] text-white text-sm font-semibold shadow-sm transition-all duration-200 flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </div>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-black no-underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </p>
      </AuthCardShell>
    </>
  );
}
