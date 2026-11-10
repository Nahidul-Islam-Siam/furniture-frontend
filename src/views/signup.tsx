"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthCardShell } from "@/components/auth/AuthCardShell";
import { cn } from "@/lib/utils";
import Seo from "../components/Seo";
import { motion } from "framer-motion";
import { useRegisterUserMutation } from "@/redux/service/auth/authApi";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least 1 uppercase letter")
    .regex(/[0-9]/, "Include at least 1 number")
    .regex(/[!@#$%^&*]/, "Include at least 1 special character (!@#$%^&*)"),
});

type Inputs = z.infer<typeof schema>;

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
  "http://localhost:5000";

export default function Signup() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const isBusy = isLoading || isRedirecting || isGoogleLoading;

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setErrorMessage(null);
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();
    const normalizedEmail = data.email.trim().toLowerCase();

    try {
      const res: any = await registerUser({
        name: fullName,
        email: normalizedEmail,
        password: data.password,
      }).unwrap();

      setIsRedirecting(true);
      if (res?.data?.isEmailVerified === false) {
        toast.success("Account created! Please verify the OTP sent to your email.");
        router.push(`/verify-otp?email=${encodeURIComponent(normalizedEmail)}`);
      } else {
        toast.success("Account created successfully! Please sign in.");
        router.push("/login");
      }
    } catch (err: any) {
      setIsRedirecting(false);
      const msg =
        err?.data?.message ||
        err?.data?.errorSources?.[0]?.message ||
        err?.message ||
        "Registration failed. Please check your details and try again.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const inputBaseClass =
    "w-full h-12 px-4 rounded-2xl bg-[#f2f4f7] hover:bg-[#ebeff3] focus:bg-white focus:ring-2 focus:ring-slate-900/10 border border-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 disabled:opacity-60";

  const handleGoogleSignup = () => {
    if (isBusy) return;
    setErrorMessage(null);
    setIsGoogleLoading(true);
    const callbackPath = `/oauth-callback?next=${encodeURIComponent("/dashboard")}`;
    window.location.href = `${BACKEND_URL}/api/v1/auth/google?redirect=${encodeURIComponent(callbackPath)}`;
  };

  return (
    <>
      <Seo
        title="Create an Account | Unique Engineering & Furniture"
        description="Create your Unique Engineering & Furniture customer account."
      />
      <AuthCardShell
        title={
          <>
            Create an
            <br />
            account
          </>
        }
      >
        {/* Google Sign Up */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isBusy}
          className="w-full h-12 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99] text-slate-700 text-sm font-medium flex items-center justify-center gap-3 shadow-sm transition-all duration-200 cursor-pointer mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
              <span>Redirecting to Google...</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                <path d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.3-10.5 7.3-17.4z" fill="#4285F4"/>
                <path d="M24 48c6.5 0 12-2.1 16-5.8l-7.9-6c-2.1 1.4-4.9 2.3-8.1 2.3-6.2 0-11.5-4.2-13.4-9.9H2.5v6.2C6.5 42.7 14.7 48 24 48z" fill="#34A853"/>
                <path d="M10.6 28.6A14.7 14.7 0 0 1 9.3 24c0-1.6.3-3.1.8-4.6v-6.2H2.5A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l8.1-6.2z" fill="#FBBC05"/>
                <path d="M24 9.5c3.5 0 6.6 1.2 9.1 3.5l6.8-6.8C35.9 2.3 30.4 0 24 0 14.7 0 6.5 5.3 2.5 13.2l8.1 6.2C12.5 13.7 17.8 9.5 24 9.5z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[11px] text-slate-400 font-medium">or sign up with email</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

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
          {/* Side-by-side First Name & Last Name */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <input
                id="firstName"
                type="text"
                aria-label="First Name"
                placeholder="First Name"
                autoComplete="given-name"
                disabled={isBusy}
                className={cn(
                  inputBaseClass,
                  errors.firstName && "bg-red-50/70 ring-2 ring-red-400/50"
                )}
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-500 text-[11px] mt-1 pl-2">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <input
                id="lastName"
                type="text"
                aria-label="Last Name"
                placeholder="Last Name"
                autoComplete="family-name"
                disabled={isBusy}
                className={cn(
                  inputBaseClass,
                  errors.lastName && "bg-red-50/70 ring-2 ring-red-400/50"
                )}
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-red-500 text-[11px] mt-1 pl-2">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <input
              id="email"
              type="email"
              aria-label="Email address"
              placeholder="Email"
              autoComplete="email"
              disabled={isBusy}
              className={cn(
                inputBaseClass,
                errors.email && "bg-red-50/70 ring-2 ring-red-400/50"
              )}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-[11px] mt-1 pl-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                aria-label="Password"
                placeholder="Password"
                autoComplete="new-password"
                disabled={isBusy}
                className={cn(
                  inputBaseClass,
                  "flex-1",
                  errors.password && "bg-red-50/70 ring-2 ring-red-400/50"
                )}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isBusy}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="w-12 h-12 flex-shrink-0 rounded-2xl bg-[#f2f4f7] hover:bg-[#e7ebf0] text-slate-600 hover:text-slate-900 flex items-center justify-center border-0 cursor-pointer transition-colors disabled:opacity-60"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password ? (
              <p className="text-red-500 text-[11px] mt-1 pl-2">
                {errors.password.message}
              </p>
            ) : (
              <p className="text-slate-400 text-[11px] mt-1 pl-2">
                8+ chars, 1 uppercase, 1 number &amp; 1 special character (!@#$%^&amp;*)
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isBusy}
              className="w-full h-12 rounded-full bg-[#0a0d14] hover:bg-[#1b2232] active:scale-[0.99] text-white text-sm font-semibold shadow-sm transition-all duration-200 flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading || isRedirecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isRedirecting ? "Redirecting..." : "Creating account..."}</span>
                </>
              ) : (
                "Create account"
              )}
            </button>
          </div>
        </form>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-slate-400 px-2">
          Signing up for an account means you agree to the{" "}
          <Link
            href="/policies/privacy-policy"
            className="text-slate-500 underline hover:text-slate-800"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            href="/policies/terms-of-service"
            className="text-slate-500 underline hover:text-slate-800"
          >
            Terms of Service
          </Link>
          .
        </p>

        <p className="mt-4 text-center text-xs text-slate-600">
          Have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-slate-900 underline underline-offset-2 hover:text-black"
          >
            Log in here
          </Link>
        </p>
      </AuthCardShell>
    </>
  );
}
