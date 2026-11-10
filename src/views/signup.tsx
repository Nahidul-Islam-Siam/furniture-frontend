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
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type Inputs = z.infer<typeof schema>;

export default function Signup() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
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
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();
    try {
      await registerUser({
        name: fullName,
        email: data.email.trim().toLowerCase(),
        password: data.password,
      }).unwrap();

      toast.success("Account created successfully! Please sign in.");
      router.push("/login");
    } catch (err: any) {
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
    "w-full h-12 px-4 rounded-2xl bg-[#f2f4f7] hover:bg-[#ebeff3] focus:bg-white focus:ring-2 focus:ring-slate-900/10 border border-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200";

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

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-[#0a0d14] hover:bg-[#1b2232] active:scale-[0.99] text-white text-sm font-semibold shadow-sm transition-all duration-200 flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
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

        <p className="mt-5 text-center text-xs text-slate-600">
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
