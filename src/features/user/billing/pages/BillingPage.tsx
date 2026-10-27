import React from "react";
import { CreditCard, Check, Download } from "lucide-react";

export const BillingPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-sm text-muted-foreground">
          Manage your payment methods, plan tiers, and invoice history.
        </p>
      </div>

      {/* Active Plan */}
      <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Current Plan</span>
          <h3 className="text-xl font-bold mt-1">Professional Plan ($29/mo)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Your next renewal date is November 18, 2026.</p>
        </div>
        <button className="rounded-lg border bg-background px-4 py-2 text-sm font-semibold shadow-sm hover:bg-accent">
          Change Plan
        </button>
      </div>

      {/* Features Included */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-3">
        <h4 className="font-semibold text-sm">Included in your plan:</h4>
        <div className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Unlimited Team Workspaces</div>
          <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Advanced Analytics & Telemetry</div>
          <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> 24/7 Priority Support</div>
          <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Custom Domain & SSL</div>
        </div>
      </div>

      {/* Invoices */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" /> Payment Invoices
          </h4>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-3">Invoice ID</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-6 py-3.5 font-medium">#INV-2026-09</td>
              <td className="px-6 py-3.5 text-muted-foreground text-xs">Oct 18, 2026</td>
              <td className="px-6 py-3.5 font-semibold">$29.00</td>
              <td className="px-6 py-3.5 text-xs text-emerald-500 font-semibold">Paid</td>
              <td className="px-6 py-3.5 text-right">
                <button className="rounded p-1 text-muted-foreground hover:bg-accent" title="Download Invoice">
                  <Download className="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingPage;
