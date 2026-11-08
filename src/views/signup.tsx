"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Seo from "../components/Seo";
import { motion } from "framer-motion";
import { useRegisterUserMutation } from "@/redux/service/auth/authApi";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type Inputs = z.infer<typeof schema>;

export default function Signup() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      await registerUser({
        name: data.name.trim(),
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
        "Registration failed. Please check your credentials.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <>
      <Seo
        title="Sign Up | GRID Furniture"
        description="Create your GRID Furniture customer account."
      />
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full md:flex md:min-h-screen">
          {/* Left side - Brand Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex md:w-1/2 bg-neutral-900 text-white items-center justify-center p-8 sm:p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e07548_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="relative max-w-md text-center space-y-4">
              <div className="inline-block bg-[#e07548] text-white font-black italic tracking-wider text-2xl px-5 py-2 rounded-xl shadow-lg mb-2">
                GRID
              </div>
              <h2 className="text-3xl font-bold font-heading text-white">
                Create Your GRID Account
              </h2>
              <p className="text-neutral-300 text-sm font-light leading-relaxed">
                Unlock instant order tracking, fast checkout, warranty management,
                and exclusive commercial offers on modern furniture.
              </p>
            </div>
          </motion.div>

          {/* Right side - Signup form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8"
          >
            <div className="w-full max-w-md">
              <div className="text-center mb-8 md:hidden">
                <Link href="/" className="inline-block">
                  <div className="bg-[#e07548] text-white font-black italic tracking-wider text-xl px-4 py-1.5 rounded-lg inline-block mb-3 shadow">
                    GRID
                  </div>
                </Link>
                <h2 className="text-2xl font-bold text-neutral-900 font-heading">
                  Create an account
                </h2>
                <p className="text-muted-foreground text-xs mt-1">
                  Join GRID Furniture
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-neutral-200/80 shadow-xl p-6 sm:p-8">
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs"
                  >
                    {errorMessage}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g. Asif Mahmud"
                      className={cn(
                        "w-full transition-all duration-200",
                        errors.name && "border-destructive focus-visible:ring-destructive"
                      )}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="asif@example.com"
                      className={cn(
                        "w-full transition-all duration-200",
                        errors.email && "border-destructive focus-visible:ring-destructive"
                      )}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className={cn(
                        "w-full transition-all duration-200",
                        errors.password && "border-destructive focus-visible:ring-destructive"
                      )}
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Confirm Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className={cn(
                        "w-full transition-all duration-200",
                        errors.confirmPassword && "border-destructive focus-visible:ring-destructive"
                      )}
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-neutral-800 text-white font-semibold py-2.5 rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
