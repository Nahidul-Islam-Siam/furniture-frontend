"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { AuthCardShell } from "@/components/auth/AuthCardShell";
import { useAppDispatch, setUser, UserRole } from "@/redux";
import {
  clearAuthCookies,
  isAdminRole,
  isJwtTokenValid,
  normalizeRoleString,
} from "@/lib/authCookies";
import toast from "react-hot-toast";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function OAuthCallbackInner() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const completeGoogleSignIn = async () => {
      try {
        // 1. Check if token was supplied via URL hash or query param
        let accessToken = searchParams.get("accessToken") || searchParams.get("token") || "";
        if (!accessToken && typeof window !== "undefined" && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.slice(1));
          accessToken = hashParams.get("accessToken") || hashParams.get("token") || "";
        }

        // 2. Otherwise exchange httpOnly refreshToken cookie set by backend Google callback
        if (!accessToken || !isJwtTokenValid(accessToken)) {
          const refreshRes = await fetch(`${API_URL}/auth/refresh-token`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });
          const refreshJson = await refreshRes.json().catch(() => null);
          accessToken =
            refreshJson?.data?.accessToken || refreshJson?.accessToken || "";
        }

        if (!accessToken || !isJwtTokenValid(accessToken)) {
          throw new Error(
            "Unable to verify your Google session. Please try signing in again."
          );
        }

        // 3. Load user profile
        const meRes = await fetch(`${API_URL}/user/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const meJson = await meRes.json().catch(() => null);
        const profile = meJson?.data;
        if (!profile) {
          throw new Error("Could not load your account profile.");
        }

        const normalizedRoleStr = normalizeRoleString(profile.role);
        const normalizedRole = UserRole[normalizedRoleStr];

        if (typeof document !== "undefined") {
          document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `role=${normalizedRole}; path=/; max-age=86400; SameSite=Lax`;
        }

        if (cancelled) return;

        dispatch(
          setUser({
            user: {
              id: profile._id || profile.id || "",
              name: profile.name,
              email: profile.email,
              phone: profile.phone,
              role: normalizedRole,
              avatar: profile.avatar,
            },
            accessToken,
            refreshToken: "",
          })
        );

        toast.success("Signed in with Google!");

        const safeNext =
          nextPath.startsWith("/") && !nextPath.startsWith("//")
            ? nextPath
            : "/dashboard";

        if (isAdminRole(normalizedRole)) {
          router.replace(safeNext.startsWith("/admin") ? safeNext : "/admin");
        } else {
          router.replace(
            safeNext.startsWith("/admin") ? "/dashboard" : safeNext
          );
        }
      } catch (err: any) {
        if (cancelled) return;
        clearAuthCookies();
        setError(err?.message || "Google sign-in failed. Please try again.");
      }
    };

    completeGoogleSignIn();
    return () => {
      cancelled = true;
    };
  }, [dispatch, nextPath, router, searchParams]);

  return (
    <AuthCardShell
      title={
        error ? (
          <>
            Sign in
            <br />
            incomplete
          </>
        ) : (
          <>
            Signing
            <br />
            you in
          </>
        )
      }
      subtitle={error ? "Authentication error" : "Completing Google authentication..."}
    >
      {error ? (
        <div className="py-4 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{error}</p>
          <Link
            href="/login"
            className="w-full h-11 rounded-full bg-[#0a0d14] hover:bg-[#1b2232] text-white text-sm font-semibold flex items-center justify-center no-underline transition-colors"
          >
            Back to Sign in
          </Link>
        </div>
      ) : (
        <div className="py-8 flex flex-col items-center gap-3 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-800" />
          <p className="text-xs text-slate-500">
            Verifying your Google account and loading your dashboard...
          </p>
        </div>
      )}
    </AuthCardShell>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense>
      <OAuthCallbackInner />
    </Suspense>
  );
}

