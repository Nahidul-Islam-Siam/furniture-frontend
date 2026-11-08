"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Seo from "../components/Seo";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  useAppDispatch,
  useAppSelector,
  setUser,
  UserRole,
} from "@/redux";
import { useLoginUserMutation } from "@/redux/service/auth/authApi";
import { ShieldAlert, UserCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type Inputs = z.infer<typeof schema>;

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loginUser, { isLoading: isApiLoading }] = useLoginUserMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const handleQuickLogin = (role: "ADMIN" | "USER") => {
    const isMockAdmin = role === "ADMIN";
    const demoToken = `demo_token_${role.toLowerCase()}_${Date.now()}`;
    if (typeof document !== "undefined") {
      document.cookie = `accessToken=${demoToken}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `token=${demoToken}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `role=${role}; path=/; max-age=86400; SameSite=Lax`;
    }
    dispatch(
      setUser({
        user: {
          id: isMockAdmin ? "admin_01" : "user_01",
          name: isMockAdmin ? "Store Admin" : "Demo Customer",
          email: isMockAdmin ? "admin@99grid.com" : "customer@99grid.com",
          role: isMockAdmin ? UserRole.ADMIN : UserRole.USER,
        },
        accessToken: demoToken,
        refreshToken: `demo_refresh_${role.toLowerCase()}`,
      })
    );

    toast.success(`Logged in as ${role}! Redirecting...`);
    router.push(isMockAdmin ? "/admin" : "/dashboard");
  };

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

      toast.success(res.message || "Successfully logged in!");
      if (normalizedRole === UserRole.ADMIN) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      // If live backend fails, fall back gracefully
      const msg =
        err?.data?.message ||
        err?.message ||
        "Invalid email or password. You can also use 1-click demo login below.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <>
      <Seo
        title="Sign In | GRID Furniture"
        description="Sign in to your GRID Furniture customer and order dashboard."
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
                Welcome to GRID Furniture
              </h2>
              <p className="text-neutral-300 text-sm font-light leading-relaxed">
                Modern work furniture in Bangladesh. Track your active orders,
                manage warranty certificates, and configure bespoke workspaces.
              </p>
            </div>
          </motion.div>

          {/* Right side - Login form */}
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
                  Welcome back
                </h2>
                <p className="text-muted-foreground text-xs mt-1">
                  Sign in to your account
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-neutral-200/80 shadow-xl p-6 sm:p-8">
                {/* ⚡ Instant Demo Access Buttons */}
                <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2.5">
                  <div className="text-[11px] font-bold text-primary uppercase tracking-wider text-center">
                    ⚡ Instant Demo Access (1-Click Login)
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleQuickLogin("USER")}
                      className="flex items-center justify-center gap-1.5 text-xs py-2 bg-background hover:bg-accent border-primary/30"
                    >
                      <UserCheck className="h-3.5 w-3.5 text-primary" /> Customer
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleQuickLogin("ADMIN")}
                      className="flex items-center justify-center gap-1.5 text-xs py-2 border-red-500/30 text-red-500 bg-background hover:bg-red-500/10"
                    >
                      <ShieldAlert className="h-3.5 w-3.5" /> Admin Portal
                    </Button>
                  </div>
                </div>

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
                      htmlFor="email"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@99grid.com"
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

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-neutral-800 text-white font-semibold py-2.5 rounded-lg"
                    disabled={isApiLoading}
                  >
                    {isApiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-bold text-primary hover:underline"
                  >
                    Create account
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
