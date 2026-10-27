import React from "react";
import { useAppSelector } from "@/redux";
import { Sparkles, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export const OverviewPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 shadow-sm">
        <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
          <Sparkles className="h-4 w-4" /> Welcome to your workspace
        </div>
        <h1 className="text-2xl font-bold tracking-tight mt-1">
          Hello, {user?.name || "Member"}!
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-xl">
          Track your active services, manage integrations, and review your account performance all in one place.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <span className="text-xs text-muted-foreground">Account Status</span>
          <div className="mt-2 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span className="text-lg font-bold">Active & Verified</span>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <span className="text-xs text-muted-foreground">Current Plan</span>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-bold">Pro Monthly</span>
            <Link to="/dashboard/billing" className="text-xs text-primary hover:underline flex items-center">
              Manage <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <span className="text-xs text-muted-foreground">API Token Usage</span>
          <div className="mt-2">
            <span className="text-lg font-bold">8,420 / 50,000</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" /> Recent Account Activity
        </h3>
        <ul className="divide-y text-sm">
          <li className="py-3 flex justify-between items-center">
            <div>
              <p className="font-medium">Signed in from Chrome on Windows</p>
              <p className="text-xs text-muted-foreground">IP 192.168.1.1</p>
            </div>
            <span className="text-xs text-muted-foreground">Today at 7:40 PM</span>
          </li>
          <li className="py-3 flex justify-between items-center">
            <div>
              <p className="font-medium">Subscription renewed successfully</p>
              <p className="text-xs text-muted-foreground">Invoice #INV-2026-09</p>
            </div>
            <span className="text-xs text-muted-foreground">Yesterday</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OverviewPage;
