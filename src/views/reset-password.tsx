"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AuthCardShell } from "@/components/auth/AuthCardShell";
import { useResetPasswordMutation } from "@/redux/service/auth/authApi";
import toast from "react-hot-toast";

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least 1 uppercase letter")
      .regex(/[0-9]/, "Include at least 1 number")
      .regex(/[!@#$%^&*]/, "Include at least 1 special character (!@#$%^&*)"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Inputs = z.infer<typeof schema>;

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(schema) });

  const inputBaseClass =
    "flex-1 h-12 px-4 rounded-2xl bg-[#f2f4f7] hover:bg-[#ebeff3] focus:bg-white focus:ring-2 focus:ring-slate-900/10 border border-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200";

  const onSubmit = async (data: Inputs) => {
    if (!token) {
      toast.error("Invalid or expired reset link. Please request a new one.");
      return;
    }
    try {
      await resetPassword({
        token,
        user: { email, newPassword: data.newPassword },
      }).unwrap();
      toast.success("Password reset successful!");
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Reset failed. The link may have expired."
      );
    }
  };

  return (
    <AuthCardShell
      title={
        <>
          Reset
          <br />
          password
        </>
      }
      subtitle="Create a strong new password"
    >
      {done ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-4 flex flex-col items-center gap-3 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
          </div>
          <p className="font-semibold text-slate-800 text-sm">
            Password updated!
          </p>
          <p className="text-xs text-slate-500">Redirecting you to sign in…</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* New Password */}
          <div>
            <div className="flex items-center gap-2">
              <input
                type={showNew ? "text" : "password"}
                placeholder="New password"
                autoComplete="new-password"
                className={cn(
                  inputBaseClass,
                  errors.newPassword && "bg-red-50/70 ring-2 ring-red-400/50"
                )}
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="w-12 h-12 flex-shrink-0 rounded-2xl bg-[#f2f4f7] hover:bg-[#e7ebf0] text-slate-600 hover:text-slate-900 flex items-center justify-center border-0 cursor-pointer transition-colors"
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.newPassword ? (
              <p className="text-red-500 text-[11px] mt-1 pl-2">
                {errors.newPassword.message}
              </p>
            ) : (
              <p className="text-slate-400 text-[11px] mt-1 pl-2">
                8+ chars, 1 uppercase, 1 number & 1 special character
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="flex items-center gap-2">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                autoComplete="new-password"
                className={cn(
                  inputBaseClass,
                  errors.confirmPassword &&
                    "bg-red-50/70 ring-2 ring-red-400/50"
                )}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="w-12 h-12 flex-shrink-0 rounded-2xl bg-[#f2f4f7] hover:bg-[#e7ebf0] text-slate-600 hover:text-slate-900 flex items-center justify-center border-0 cursor-pointer transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-[11px] mt-1 pl-2">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full h-12 rounded-full bg-[#0a0d14] hover:bg-[#1b2232] active:scale-[0.99] text-white text-sm font-semibold shadow-sm transition-all duration-200 flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : (
                "Reset password"
              )}
            </button>
          </div>
        </form>
      )}

      {!done && (
        <p className="mt-5 text-center text-xs text-slate-500">
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-semibold text-slate-900 underline underline-offset-2 hover:text-black"
          >
            Sign in
          </Link>
        </p>
      )}
    </AuthCardShell>
  );
}

