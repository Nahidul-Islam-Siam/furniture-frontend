import React from "react";
import { Lock, Bell } from "lucide-react";

export const SettingsPage: React.FC = () => {
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm"
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button className="rounded-lg border bg-background px-4 py-2 text-sm font-semibold shadow-sm hover:bg-accent">
            Update Password
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-base flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" /> Email Notifications
        </h3>
        <div className="space-y-3 text-sm">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary" />
            <span>Receive weekly activity summary reports</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary" />
            <span>Notify me of security alerts and new logins</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
