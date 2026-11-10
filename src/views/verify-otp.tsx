"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { AuthCardShell } from "@/components/auth/AuthCardShell";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/service/auth/authApi";
import toast from "react-hot-toast";

const OTP_LENGTH = 6;

export default function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const redirectTo = searchParams.get("redirect") || "/login";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [sendOtp, { isLoading: isResending }] = useSendOtpMutation();

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < OTP_LENGTH - 1) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      inputsRef.current[idx - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((d, i) => { next[i] = d; });
    setOtp(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      toast.error("Please enter all 6 digits");
      return;
    }
    try {
      await verifyOtp({ email, otp: code }).unwrap();
      toast.success("Email verified successfully!");
      router.push(redirectTo);
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid or expired OTP. Try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await sendOtp({ email }).unwrap();
      toast.success("New OTP sent to your email!");
      setCountdown(60);
      setCanResend(false);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <AuthCardShell
      title={
        <>
          Verify
          <br />
          your email
        </>
      }
      subtitle={email ? `Code sent to ${email}` : "Enter the 6-digit code"}
    >
      {/* OTP boxes */}
      <div className="flex justify-center gap-2.5 my-2" onPaste={handlePaste}>
        {otp.map((digit, idx) => (
          <motion.input
            key={idx}
            ref={(el) => { inputsRef.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`w-11 h-13 text-center text-xl font-bold rounded-2xl border-2 outline-none transition-all duration-150 bg-[#f2f4f7]
              ${digit
                ? "border-slate-800 bg-white text-slate-900"
                : "border-transparent text-slate-400"
              }
              focus:border-slate-800 focus:bg-white focus:ring-0`}
            style={{ height: "52px" }}
          />
        ))}
      </div>

      <div className="pt-3">
        <button
          onClick={handleVerify}
          disabled={isVerifying || otp.join("").length < OTP_LENGTH}
          className="w-full h-12 rounded-full bg-[#0a0d14] hover:bg-[#1b2232] active:scale-[0.99] text-white text-sm font-semibold shadow-sm transition-all duration-200 flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            "Verify code"
          )}
        </button>
      </div>

      {/* Resend */}
      <div className="mt-5 flex flex-col items-center gap-1.5">
        {canResend ? (
          <button
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-black bg-transparent border-0 cursor-pointer transition-colors"
          >
            {isResending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5" />
            )}
            Resend code
          </button>
        ) : (
          <p className="text-[11px] text-slate-400">
            Resend available in{" "}
            <span className="font-semibold text-slate-600">{countdown}s</span>
          </p>
        )}

        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 no-underline mt-1"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to sign in
        </Link>
      </div>
    </AuthCardShell>
  );
}

