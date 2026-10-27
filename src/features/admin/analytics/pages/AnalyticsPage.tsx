import React from "react";
import { Users, DollarSign, Activity, TrendingUp } from "lucide-react";

export const AnalyticsPage: React.FC = () => {
  const stats = [
    { name: "Total Revenue", value: "$45,231.89", change: "+20.1%", icon: DollarSign },
    { name: "Active Users", value: "2,350", change: "+180.1%", icon: Users },
    { name: "Sales Volume", value: "+12,234", change: "+19%", icon: Activity },
    { name: "Active Subscriptions", value: "573", change: "+201 since last month", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Analytics & System Overview</h1>
        <p className="text-sm text-muted-foreground">
          Real-time metrics, telemetry, and platform activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{stat.name}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold">{stat.value}</span>
                <p className="text-xs text-emerald-500 font-medium mt-1">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-base mb-2">Recent System Events</h3>
          <ul className="divide-y text-sm">
            <li className="py-2.5 flex justify-between">
              <span>Database automated backup completed</span>
              <span className="text-xs text-muted-foreground">12m ago</span>
            </li>
            <li className="py-2.5 flex justify-between">
              <span>High API usage detected on Endpoint /api/v1/auth</span>
              <span className="text-xs text-muted-foreground">1h ago</span>
            </li>
            <li className="py-2.5 flex justify-between">
              <span>System security scan passed with 0 vulnerabilities</span>
              <span className="text-xs text-muted-foreground">3h ago</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-base mb-2">Platform Health</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>CPU Load</span>
                <span className="font-semibold">24%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-emerald-500 w-[24%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Memory Usage</span>
                <span className="font-semibold">58%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary w-[58%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
