"use client";

import React from "react";
import { CreditCard, Check, Download } from "lucide-react";
import { Table, Tag, Button, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import AntdProvider from "@/lib/antd/AntdProvider";

interface InvoiceItem {
  key: string;
  id: string;
  date: string;
  amount: string;
  plan: string;
  status: "Paid" | "Pending" | "Failed";
}

export const BillingPage: React.FC = () => {
  const invoices: InvoiceItem[] = [
    {
      key: "1",
      id: "INV-2026-10",
      date: "Nov 01, 2026",
      amount: "$29.00",
      plan: "Professional Plan (Monthly)",
      status: "Paid",
    },
    {
      key: "2",
      id: "INV-2026-09",
      date: "Oct 01, 2026",
      amount: "$29.00",
      plan: "Professional Plan (Monthly)",
      status: "Paid",
    },
    {
      key: "3",
      id: "INV-2026-08",
      date: "Sep 01, 2026",
      amount: "$29.00",
      plan: "Professional Plan (Monthly)",
      status: "Paid",
    },
    {
      key: "4",
      id: "INV-2026-07",
      date: "Aug 01, 2026",
      amount: "$29.00",
      plan: "Professional Plan (Monthly)",
      status: "Paid",
    },
    {
      key: "5",
      id: "INV-2026-06",
      date: "Jul 01, 2026",
      amount: "$29.00",
      plan: "Professional Plan (Monthly)",
      status: "Paid",
    },
    {
      key: "6",
      id: "INV-2026-05",
      date: "Jun 01, 2026",
      amount: "$29.00",
      plan: "Professional Plan (Monthly)",
      status: "Paid",
    },
  ];

  const columns: ColumnsType<InvoiceItem> = [
    {
      title: "Invoice ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => <span className="font-semibold text-foreground">#{id}</span>,
    },
    {
      title: "Billing Period",
      dataIndex: "plan",
      key: "plan",
      render: (plan: string) => <span className="text-sm">{plan}</span>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => <span className="text-xs text-muted-foreground">{date}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: string) => <span className="font-bold text-foreground">{amount}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: InvoiceItem["status"]) => {
        const color = status === "Paid" ? "green" : status === "Pending" ? "gold" : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Receipt",
      key: "action",
      align: "right",
      render: () => (
        <Tooltip title="Download PDF Receipt">
          <Button
            type="text"
            size="small"
            icon={<Download className="h-4 w-4 text-muted-foreground hover:text-foreground" />}
            onClick={() => alert("Invoice downloaded successfully")}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <AntdProvider>
      <div className="space-y-6 max-w-5xl">
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
            <p className="text-xs text-muted-foreground mt-0.5">Your next renewal date is December 01, 2026.</p>
          </div>
          <button className="rounded-lg border bg-background px-4 py-2 text-sm font-semibold shadow-sm hover:bg-accent transition-colors">
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

        {/* Invoices Ant Design Table */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <h4 className="font-semibold text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" /> Payment Invoices
            </h4>
            <span className="text-xs text-muted-foreground">Automated monthly billing records</span>
          </div>

          <Table
            dataSource={invoices}
            columns={columns}
            rowKey="id"
            size="middle"
            scroll={{ x: 650 }}
            pagination={{
              defaultPageSize: 5,
              pageSizeOptions: ["5", "10", "20"],
              showSizeChanger: true,
              showQuickJumper: true,
              responsive: true,
              showTotal: (total, range) => (
                <span style={{ fontSize: 13, color: "#666" }}>
                  Showing <strong>{range[0]}-{range[1]}</strong> of <strong>{total}</strong> invoices
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

export default BillingPage;
