"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, Bell, Loader2, Eye, EyeOff, KeyRound } from "lucide-react";
import { useChangeUserPasswordMutation } from "@/redux/service/profileData";
import { useSetPasswordMutation } from "@/redux/service/auth/authApi";
import toast from "react-hot-toast";

const NOTIF_STORAGE_KEY = "uef_user_notifications";

export const SettingsPage: React.FC = () => {
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangeUserPasswordMutation();
  const [setPassword, { isLoading: isSettingPassword }] =
    useSetPasswordMutation();

  const [mode, setMode] = useState<"change" | "set">("change");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  const isSubmittingPassword = isChangingPassword || isSettingPassword;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.orderUpdates === "boolean") {
          setOrderUpdates(parsed.orderUpdates);
        }
        if (typeof parsed.securityAlerts === "boolean") {
          setSecurityAlerts(parsed.securityAlerts);
        }
      }
    } catch {}
  }, []);

  const handleToggleNotification = (
    key: "orderUpdates" | "securityAlerts",
    checked: boolean
  ) => {
    const next = {
      orderUpdates: key === "orderUpdates" ? checked : orderUpdates,
      securityAlerts: key === "securityAlerts" ? checked : securityAlerts,
    };
    if (key === "orderUpdates") setOrderUpdates(checked);
    if (key === "securityAlerts") setSecurityAlerts(checked);
    try {
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(next));
      toast.success("Notification preference saved.");
    } catch {}
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "change" && !oldPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    if (mode === "change" && oldPassword === newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    try {
      if (mode === "set") {
        const res = await setPassword({ password: newPassword }).unwrap();
        toast.success(res?.message || "Password set successfully!");
        setMode("change");
      } else {
        const res = await changePassword({
          oldPassword,
          newPassword,
        }).unwrap();
        toast.success(res?.message || "Password updated successfully!");
      }

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Failed to update password";
      toast.error(msg);
      if (
        mode === "change" &&
        msg.toLowerCase().includes("no password")
      ) {
        setMode("set");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your security preferences, password, and email notifications.
        </p>
      </div>

      {/* Security */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-semibold text-base flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" /> Password &amp; Security
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              For your account security, choose a strong password with at least 8 characters.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setMode((prev) => (prev === "change" ? "set" : "change"))
            }
            className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-cyan-700 hover:text-cyan-900 underline underline-offset-2 bg-transparent border-0 cursor-pointer"
          >
            <KeyRound className="h-3.5 w-3.5" />
            {mode === "change"
              ? "Signed up with Google? Set password"
              : "Already have a password? Change it"}
          </button>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
          <div
            className={`grid gap-4 ${
              mode === "change" ? "sm:grid-cols-3" : "sm:grid-cols-2"
            }`}
          >
            {mode === "change" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Current Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showOld ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isSubmittingPassword}
                    className="w-full rounded-md border bg-background px-3 py-2 pr-9 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld((p) => !p)}
                    aria-label={showOld ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground bg-transparent border-0 cursor-pointer"
                  >
                    {showOld ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-muted-foreground">
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 chars"
                  required
                  minLength={8}
                  disabled={isSubmittingPassword}
                  className="w-full rounded-md border bg-background px-3 py-2 pr-9 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  aria-label={showNew ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground bg-transparent border-0 cursor-pointer"
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Confirm New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  disabled={isSubmittingPassword}
                  className="w-full rounded-md border bg-background px-3 py-2 pr-9 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground bg-transparent border-0 cursor-pointer"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Forgot your current password?
            </Link>
            <button
              type="submit"
              disabled={isSubmittingPassword}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-0"
            >
              {isSubmittingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />{" "}
                  {mode === "set" ? "Setting password..." : "Updating..."}
                </>
              ) : mode === "set" ? (
                "Set Password"
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-base flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" /> Email Notifications
        </h3>
        <div className="space-y-3 text-sm">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={orderUpdates}
              onChange={(e) =>
                handleToggleNotification("orderUpdates", e.target.checked)
              }
              className="rounded border-gray-300 text-primary"
            />
            <span>Receive order status and shipping tracking updates</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={securityAlerts}
              onChange={(e) =>
                handleToggleNotification("securityAlerts", e.target.checked)
              }
              className="rounded border-gray-300 text-primary"
            />
            <span>Notify me of security alerts and login activity</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
