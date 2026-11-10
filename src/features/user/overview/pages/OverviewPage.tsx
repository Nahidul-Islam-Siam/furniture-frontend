"use client";

import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux";
import {
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Clock,
  ArrowRight,
  Package,
} from "lucide-react";
import { Table, Tag, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import AntdProvider from "@/lib/antd/AntdProvider";
import { useGetMyOrdersQuery, IOrder } from "@/redux/service/orderApi";
import {
  getOrderAmount,
  getOrderStatus,
  getPaymentMethod,
} from "@/lib/orderUtils";
import { OrderProgressStepper } from "@/components/dashboard/OrderProgressStepper";

export const OverviewPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isFetching: isOrdersFetching,
    isError: isOrdersError,
    refetch,
  } = useGetMyOrdersQuery();

  const ordersList: IOrder[] = ordersData?.data || [];
  const totalOrders = ordersList.length;
  const totalSpent = ordersList.reduce((acc, o) => acc + getOrderAmount(o), 0);
  const latestOrder = ordersList[0];

  const getStatusTag = (status: string) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "delivered":
        return <Tag color="green">Delivered</Tag>;
      case "shipped":
        return <Tag color="purple">Shipped</Tag>;
      case "processing":
      case "confirmed":
        return <Tag color="cyan">Processing</Tag>;
      case "cancelled":
        return <Tag color="red">Cancelled</Tag>;
      default:
        return <Tag color="gold">Pending</Tag>;
    }
  };

  const columns: ColumnsType<IOrder> = [
    {
      title: "Order ID",
      key: "orderNumber",
      render: (_, record) => (
        <span className="font-bold text-foreground">
          #{record.orderNumber || record._id.slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      title: "Items",
      key: "items",
      render: (_, record) => (
        <span className="text-sm font-medium">
          {record.items?.[0]?.name || "Custom Furniture Item"}
          {(record.items?.length || 0) > 1 &&
            ` (+${record.items.length - 1} more)`}
        </span>
      ),
    },
    {
      title: "Amount (BDT)",
      key: "amount",
      render: (_, record) => (
        <span className="font-semibold text-sm">
          Tk {getOrderAmount(record).toLocaleString("en-BD")}
        </span>
      ),
    },
    {
      title: "Payment",
      key: "payment",
      render: (_, record) => (
        <Tag color="blue" style={{ textTransform: "uppercase" }}>
          {getPaymentMethod(record)}
        </Tag>
      ),
    },
    {
      title: "Fulfillment Status",
      key: "status",
      render: (_, record) => getStatusTag(getOrderStatus(record)),
    },
    {
      title: "Date",
      key: "date",
      render: (_, record) => (
        <span className="text-xs text-muted-foreground">
          {record.createdAt
            ? new Date(record.createdAt).toLocaleDateString("en-BD", {
                month: "short",
                day: "numeric",
              })
            : "Today"}
        </span>
      ),
    },
  ];

  return (
    <AntdProvider>
      <div className="space-y-6 font-sans">
        {/* Welcome Banner */}
        <div className="rounded-2xl border bg-gradient-to-r from-cyan-500/10 via-sky-500/5 to-transparent p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-700 font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4" /> Welcome to your account
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1">
              Hello, {user?.name || "Member"}!
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Track your custom furniture orders, CNC fabrication progress, and
              manage your account details.
            </p>
          </div>

          <Link href="/collections">
            <Button
              type="primary"
              size="large"
              style={{ background: "#09090b" }}
              icon={<ShoppingBag className="w-4 h-4 inline-block mr-1" />}
            >
              Explore Furniture
            </Button>
          </Link>
        </div>

        {/* Quick Stats with Skeleton Loading */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <span className="text-xs text-muted-foreground">
              Total Orders Placed
            </span>
            {isOrdersLoading ? (
              <div className="mt-2 h-8 w-16 rounded-md bg-slate-200 animate-pulse" />
            ) : (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl font-bold">{totalOrders}</span>
                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <span className="text-xs text-muted-foreground">
              Total Order Value
            </span>
            {isOrdersLoading ? (
              <div className="mt-2 h-8 w-28 rounded-md bg-slate-200 animate-pulse" />
            ) : (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl font-bold text-emerald-600">
                  Tk {totalSpent.toLocaleString("en-BD")}
                </span>
              </div>
            )}
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <span className="text-xs text-muted-foreground">Account Status</span>
            <div className="mt-2 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span className="text-lg font-bold">Active &amp; Verified</span>
            </div>
          </div>
        </div>

        {/* Latest Order Live Tracking Stepper */}
        {latestOrder && (
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-cyan-600" />
                <h3 className="font-semibold text-base m-0">
                  Latest Order Tracking (#
                  {latestOrder.orderNumber ||
                    latestOrder._id.slice(-6).toUpperCase()}
                  )
                </h3>
              </div>
              <Link
                href="/dashboard/orders"
                className="text-xs font-semibold text-cyan-700 hover:underline flex items-center gap-1 no-underline"
              >
                <span>Open Order Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <OrderProgressStepper status={getOrderStatus(latestOrder)} />
          </div>
        )}

        {/* My Furniture Orders Ant Design Table */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" /> My Recent
              Orders
            </h3>
            <Link
              href="/dashboard/orders"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 no-underline"
            >
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {isOrdersError ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm text-red-600">
                Unable to load your recent orders right now.
              </p>
              <Button
                size="small"
                loading={isOrdersFetching}
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          ) : (
            <Table
              dataSource={ordersList}
              columns={columns}
              rowKey="_id"
              loading={isOrdersLoading}
              size="middle"
              scroll={{ x: 600 }}
              locale={{
                emptyText: (
                  <div className="py-8 text-center text-muted-foreground space-y-2">
                    <p>No orders placed yet.</p>
                    <Link
                      href="/collections"
                      className="text-primary hover:underline text-xs font-semibold"
                    >
                      Browse our catalog &amp; place your first order
                    </Link>
                  </div>
                ),
              }}
              pagination={{
                defaultPageSize: 5,
                pageSizeOptions: ["5", "10", "20"],
                showSizeChanger: true,
                responsive: true,
              }}
            />
          )}
        </div>
      </div>
    </AntdProvider>
  );
};

export default OverviewPage;
