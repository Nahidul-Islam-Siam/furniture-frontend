"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthCardShell } from "@/components/auth/AuthCardShell";
import Seo from "../components/Seo";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppDispatch, setUser, UserRole } from "@/redux";
import { useLoginUserMutation } from "@/redux/service/auth/authApi";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type Inputs = z.infer<typeof schema>;

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
  "http://localhost:5000";

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loginUser, { isLoading: isApiLoading }] = useLoginUserMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setErrorMessage(null);
    try {
      const res = await loginUser({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      }).unwrap();

      const user = res.data.user;
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken || "";

      const normalizedRole =
        user.role?.toLowerCase() === "admin" ||
        user.role?.toLowerCase() === "super_admin"
          ? UserRole.ADMIN
          : UserRole.USER;

      if (typeof document !== "undefined") {
        document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `role=${normalizedRole}; path=/; max-age=86400; SameSite=Lax`;
      }

      dispatch(
        setUser({
          user: {
            ...user,
            role: normalizedRole,
          },
          accessToken,
          refreshToken,
        })
      );

      toast.success(res.message || "Successfully signed in!");

      const params =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;
      const redirect = params?.get("redirect");

      if (normalizedRole === UserRole.ADMIN) {
        router.push(
          redirect && redirect.startsWith("/admin") ? redirect : "/admin"
        );
      } else {
        router.push(
          redirect &&
            redirect.startsWith("/") &&
            !redirect.startsWith("//") &&
            !redirect.startsWith("/admin")
            ? redirect
            : "/dashboard"
        );
      }
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Invalid email or password. Please check your credentials and try again.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const inputBaseClass =
    "w-full h-12 px-4 rounded-2xl bg-[#f2f4f7] hover:bg-[#ebeff3] focus:bg-white focus:ring-2 focus:ring-slate-900/10 border border-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200";

  const handleGoogleLogin = () => {
    const redirectParam =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("redirect") || ""
        : "";
    window.location.href = `${BACKEND_URL}/api/v1/auth/google?redirect=${encodeURIComponent(redirectParam || "/dashboard")}`;
  };

  return (
    <>
      <Seo
        title="Sign In | Unique Engineering & Furniture"
        description="Sign in to your Unique Engineering & Furniture account."
      />
      <AuthCardShell
        title={
          <>
            Welcome
            <br />
            back
          </>
        }
        subtitle="Sign in to your account"
      >
        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full h-12 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center justify-center gap-3 shadow-sm transition-all duration-200 cursor-pointer mb-4"
        >
          {/* Google SVG */}
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <path d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.3-10.5 7.3-17.4z" fill="#4285F4"/>
            <path d="M24 48c6.5 0 12-2.1 16-5.8l-7.9-6c-2.1 1.4-4.9 2.3-8.1 2.3-6.2 0-11.5-4.2-13.4-9.9H2.5v6.2C6.5 42.7 14.7 48 24 48z" fill="#34A853"/>
            <path d="M10.6 28.6A14.7 14.7 0 0 1 9.3 24c0-1.6.3-3.1.8-4.6v-6.2H2.5A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l8.1-6.2z" fill="#FBBC05"/>
            <path d="M24 9.5c3.5 0 6.6 1.2 9.1 3.5l6.8-6.8C35.9 2.3 30.4 0 24 0 14.7 0 6.5 5.3 2.5 13.2l8.1 6.2C12.5 13.7 17.8 9.5 24 9.5z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[11px] text-slate-400 font-medium">or sign in with email</span>
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
          <div>
            <input
              id="email"
              type="email"
              aria-label="Email address"
              placeholder="Email"
              autoComplete="email"
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
                autoComplete="current-password"
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
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="w-12 h-12 flex-shrink-0 rounded-2xl bg-[#f2f4f7] hover:bg-[#e7ebf0] text-slate-600 hover:text-slate-900 flex items-center justify-center border-0 cursor-pointer transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[11px] mt-1 pl-2">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot password link */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-[11px] text-slate-500 hover:text-slate-800 underline underline-offset-2 no-underline hover:no-underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={isApiLoading}
              className="w-full h-12 rounded-full bg-[#0a0d14] hover:bg-[#1b2232] active:scale-[0.99] text-white text-sm font-semibold shadow-sm transition-all duration-200 flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isApiLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-slate-400 px-2">
          Signing in to your account means you agree to our{" "}
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
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-slate-900 underline underline-offset-2 hover:text-black"
          >
            Create account
          </Link>
        </p>
      </AuthCardShell>
    </>
  );
}
