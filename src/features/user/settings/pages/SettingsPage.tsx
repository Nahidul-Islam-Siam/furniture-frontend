"use client";

import React, { useState, useEffect } from "react";
import { Lock, Bell, Loader2 } from "lucide-react";
import { useChangeUserPasswordMutation } from "@/redux/service/profileData";
import toast from "react-hot-toast";

const NOTIF_STORAGE_KEY = "uef_user_notifications";

export const SettingsPage: React.FC = () => {
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangeUserPasswordMutation();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

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

    if (!oldPassword) {
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

    if (oldPassword === newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    try {
      const res = await changePassword({
        oldPassword,
        newPassword,
      }).unwrap();

      toast.success(res?.message || "Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to update password"
      );
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
        <h3 className="font-semibold text-base flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" /> Password & Security
        </h3>
        <p className="text-xs text-muted-foreground">
          For your account security, choose a strong password with at least 8 characters.
        </p>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Current Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 chars"
                required
                minLength={8}
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition disabled:opacity-50"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Updating...
                </>
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
