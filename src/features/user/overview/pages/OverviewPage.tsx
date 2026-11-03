"use client";

import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux";
import { Sparkles, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import AntdProvider from "@/lib/antd/AntdProvider";

interface ActivityLog {
  key: string;
  activity: string;
  details: string;
  device: string;
  status: "Success" | "Security Alert" | "Info";
  time: string;
}

export const OverviewPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const activities: ActivityLog[] = [
    {
      key: "1",
      activity: "Active Web Session",
      details: "Signed in via Email & Password (IP: 192.168.1.1)",
      device: "Windows 11 · Chrome 130",
      status: "Success",
      time: "Today at 7:40 PM",
    },
    {
      key: "2",
      activity: "Monthly Renewal Succeeded",
      details: "Automatic charge processed ($29.00) · #INV-2026-10",
      device: "Billing Engine",
      status: "Success",
      time: "Nov 01, 2026",
    },
    {
      key: "3",
      activity: "API Token Generated",
      details: "Read/Write Token created for workspace integration",
      device: "MacOS · Safari",
      status: "Info",
      time: "Oct 28, 2026",
    },
    {
      key: "4",
      activity: "Security Password Changed",
      details: "Admin credentials updated via account settings",
      device: "Windows 11 · Chrome 130",
      status: "Success",
      time: "Oct 22, 2026",
    },
    {
      key: "5",
      activity: "Profile Details Updated",
      details: "Avatar and contact phone information refreshed",
      device: "Mobile · Safari iOS",
      status: "Info",
      time: "Oct 15, 2026",
    },
    {
      key: "6",
      activity: "Two-Factor Auth Verified",
      details: "Authenticator App TOTP confirmed successfully",
      device: "Windows 11 · Chrome 130",
      status: "Success",
      time: "Oct 01, 2026",
    },
  ];

  const columns: ColumnsType<ActivityLog> = [
    {
      title: "Activity / Event",
      dataIndex: "activity",
      key: "activity",
      render: (text: string, record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground text-sm">{text}</span>
          <span className="text-xs text-muted-foreground">{record.details}</span>
        </div>
      ),
    },
    {
      title: "Device / Source",
      dataIndex: "device",
      key: "device",
      render: (device: string) => (
        <span className="text-xs text-muted-foreground">{device}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: ActivityLog["status"]) => {
        const color = status === "Success" ? "green" : status === "Security Alert" ? "red" : "blue";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (time: string) => <span className="text-xs text-muted-foreground">{time}</span>,
    },
  ];

  return (
    <AntdProvider>
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
              <Link href="/dashboard/billing" className="text-xs text-primary hover:underline flex items-center">
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

        {/* Recent Activity Ant Design Table */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" /> Recent Account Activity
            </h3>
            <span className="text-xs text-muted-foreground">Security & login audits</span>
          </div>

          <Table
            dataSource={activities}
            columns={columns}
            rowKey="key"
            size="middle"
            scroll={{ x: 600 }}
            pagination={{
              defaultPageSize: 4,
              pageSizeOptions: ["4", "8", "12"],
              showSizeChanger: true,
              showQuickJumper: true,
              responsive: true,
              showTotal: (total, range) => (
                <span style={{ fontSize: 13, color: "#666" }}>
                  Showing <strong>{range[0]}-{range[1]}</strong> of <strong>{total}</strong> logs
                </span>
              ),
              position: ["bottomRight"],
              style: { marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 },
            }}
          />
        </div>
      </div>
    </AntdProvider>
  );
};

export default OverviewPage;
