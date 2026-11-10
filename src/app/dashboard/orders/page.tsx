"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Table, Tag, Button, Modal, Popconfirm, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import AntdProvider from "@/lib/antd/AntdProvider";
import { ShoppingBag, Eye, XCircle, Search } from "lucide-react";
import { OrderProgressStepper } from "@/components/dashboard/OrderProgressStepper";
import {
  useGetMyOrdersQuery,
  useCancelOrderMutation,
  IOrder,
} from "@/redux/service/orderApi";
import {
  getOrderAmount,
  getOrderStatus,
  getPaymentMethod,
  getPaymentStatus,
} from "@/lib/orderUtils";
import toast from "react-hot-toast";

export default function MyOrdersPage() {
  const { data: ordersData, isLoading, isFetching, isError, refetch } =
    useGetMyOrdersQuery();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const orders: IOrder[] = ordersData?.data || [];

  const filteredOrders = orders.filter((o) => {
    const q = searchText.trim().toLowerCase();
    const orderNo = (o.orderNumber || o._id || "").toLowerCase();
    const itemsText = (o.items || []).map((i) => i.name).join(" ").toLowerCase();
    const matchesSearch = !q || orderNo.includes(q) || itemsText.includes(q);
    const status = getOrderStatus(o);
    const matchesStatus =
      statusFilter === "ALL" ||
      status === statusFilter.toLowerCase() ||
      (statusFilter === "processing" && status === "confirmed");
    return matchesSearch && matchesStatus;
  });

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId).unwrap();
      toast.success("Order cancelled successfully.");
      setSelectedOrder(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Unable to cancel order.");
    }
  };

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
        <div>
          <span className="font-bold text-neutral-900">
            #{record.orderNumber || record._id.slice(-6).toUpperCase()}
          </span>
          <div className="text-[11px] text-neutral-400">
            {record.createdAt
              ? new Date(record.createdAt).toLocaleDateString("en-BD")
              : "-"}
          </div>
        </div>
      ),
    },
    {
      title: "Furniture Items",
      key: "items",
      render: (_, record) => (
        <div>
          <div className="font-medium text-sm text-neutral-800">
            {record.items?.[0]?.name || "Furniture Product"}
          </div>
          {(record.items?.length || 0) > 1 && (
            <div className="text-xs text-neutral-500">
              +{record.items.length - 1} more items
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => (
        <span className="font-bold text-neutral-900 text-sm">
          Tk {getOrderAmount(record).toLocaleString("en-BD")}.00
        </span>
      ),
    },
    {
      title: "Payment",
      key: "payment",
      render: (_, record) => (
        <Tag color="blue" style={{ textTransform: "uppercase" }}>
          {getPaymentMethod(record)} • {getPaymentStatus(record)}
        </Tag>
      ),
    },
    {
      title: "Fulfillment Status",
      key: "status",
      render: (_, record) => getStatusTag(getOrderStatus(record)),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          size="small"
          icon={<Eye className="w-3.5 h-3.5" />}
          onClick={() => setSelectedOrder(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <AntdProvider>
      <div className="space-y-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              My Furniture Orders
            </h1>
            <p className="text-sm text-neutral-500">
              Track delivery progress, fulfillment status, and view order details.
            </p>
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white shadow hover:bg-neutral-800 transition no-underline"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>

        {/* Search & Status Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border bg-white p-3.5 shadow-sm">
          <Input
            placeholder="Search by Order ID or item..."
            prefix={<Search className="w-3.5 h-3.5 text-neutral-400 mr-1" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="sm:max-w-xs"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            {["ALL", "pending", "processing", "shipped", "delivered", "cancelled"].map(
              (st) => {
                const active = statusFilter === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize border cursor-pointer transition-colors ${
                      active
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {st === "ALL" ? "All" : st}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden p-4">
          {isError ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm text-red-600">
                Could not load your orders right now.
              </p>
              <Button size="small" loading={isFetching} onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : (
            <Table
              rowKey="_id"
              columns={columns}
              dataSource={filteredOrders}
              loading={isLoading}
              scroll={{ x: 650 }}
              pagination={{ pageSize: 10 }}
              locale={{
                emptyText: (
                  <div className="py-10 text-center text-neutral-500 space-y-2">
                    <p>
                      {orders.length > 0
                        ? "No orders match this filter."
                        : "You haven't placed any orders yet."}
                    </p>
                    {orders.length === 0 && (
                      <Link
                        href="/collections"
                        className="text-primary hover:underline text-xs font-semibold"
                      >
                        Explore our furniture collections
                      </Link>
                    )}
                  </div>
                ),
              }}
            />
          )}
        </div>

        {/* Order Details Modal */}
        <Modal
          title={
            selectedOrder ? (
              <span className="font-bold">
                Order #{selectedOrder.orderNumber || selectedOrder._id}
              </span>
            ) : (
              "Order Details"
            )
          }
          open={Boolean(selectedOrder)}
          onCancel={() => setSelectedOrder(null)}
          footer={
            selectedOrder && getOrderStatus(selectedOrder) === "pending" ? (
              <div className="flex justify-between items-center pt-2">
                <Popconfirm
                  title="Cancel this order?"
                  description="Are you sure you want to cancel this pending order?"
                  onConfirm={() => handleCancelOrder(selectedOrder._id)}
                  okText="Yes, Cancel Order"
                  cancelText="Keep Order"
                  okButtonProps={{ danger: true, loading: isCancelling }}
                >
                  <Button
                    danger
                    size="small"
                    icon={<XCircle className="w-3.5 h-3.5 inline mr-1" />}
                    loading={isCancelling}
                  >
                    Cancel Order
                  </Button>
                </Popconfirm>
                <Button onClick={() => setSelectedOrder(null)}>Close</Button>
              </div>
            ) : null
          }
          width={650}
        >
          {selectedOrder && (
            <div className="space-y-5 pt-3">
              {/* Visual Order Tracking Stepper */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <OrderProgressStepper status={getOrderStatus(selectedOrder)} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-100 text-xs">
                <div>
                  <span className="text-neutral-400 block">Status</span>
                  <div className="mt-1">
                    {getStatusTag(getOrderStatus(selectedOrder))}
                  </div>
                </div>
                <div>
                  <span className="text-neutral-400 block">Payment Method</span>
                  <span className="font-semibold uppercase text-neutral-800 mt-1 block">
                    {getPaymentMethod(selectedOrder)} (
                    {getPaymentStatus(selectedOrder)})
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Date</span>
                  <span className="font-semibold text-neutral-800 mt-1 block">
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleDateString(
                          "en-BD"
                        )
                      : "-"}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500">
                  Ordered Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="divide-y border rounded-xl overflow-hidden">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center font-bold text-neutral-400 text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900">
                            {item.name}
                          </div>
                          <div className="text-xs text-neutral-500">
                            Quantity: {item.quantity} × Tk{" "}
                            {(item.price || 0).toLocaleString("en-BD")}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-neutral-900">
                        Tk{" "}
                        {(
                          (item.price || 0) * (item.quantity || 1)
                        ).toLocaleString("en-BD")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-2 p-3.5 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                <h4 className="font-bold text-neutral-700">Delivery Address</h4>
                <p className="text-neutral-600 leading-relaxed">
                  {selectedOrder.shippingAddress?.recipientName} •{" "}
                  {selectedOrder.shippingAddress?.phone}
                  <br />
                  {selectedOrder.shippingAddress?.street},{" "}
                  {selectedOrder.shippingAddress?.city}{" "}
                  {selectedOrder.shippingAddress?.postalCode}
                </p>
              </div>

              {/* Total Summary */}
              <div className="pt-2 flex justify-between items-center text-base font-bold border-t">
                <span>Total Order Amount</span>
                <span>
                  Tk {getOrderAmount(selectedOrder).toLocaleString("en-BD")}.00
                </span>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AntdProvider>
  );
}
