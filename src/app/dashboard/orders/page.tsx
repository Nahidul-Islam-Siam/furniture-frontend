"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Table, Tag, Button, Modal, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import AntdProvider from "@/lib/antd/AntdProvider";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  Eye,
  ArrowLeft,
  Calendar,
  CreditCard,
} from "lucide-react";
import { useGetMyOrdersQuery, IOrder } from "@/redux/service/orderApi";

export default function MyOrdersPage() {
  const { data: ordersData, isLoading, refetch } = useGetMyOrdersQuery();
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const orders: IOrder[] = ordersData?.data || [];

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
              ? new Date(record.createdAt).toLocaleDateString()
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
          Tk {(record.finalAmount || record.totalAmount || 0).toLocaleString("en-BD")}.00
        </span>
      ),
    },
    {
      title: "Payment",
      key: "payment",
      render: (_, record) => (
        <Tag color="blue" style={{ textTransform: "uppercase" }}>
          {record.paymentMethod} • {record.paymentStatus || "pending"}
        </Tag>
      ),
    },
    {
      title: "Fulfillment Status",
      key: "status",
      render: (_, record) => getStatusTag(record.orderStatus),
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
              Track delivery progress, assembly status, and view past invoices.
            </p>
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white shadow hover:bg-neutral-800 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden p-4">
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={orders}
            loading={isLoading}
            pagination={{ pageSize: 10 }}
          />
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
          footer={null}
          width={650}
        >
          {selectedOrder && (
            <div className="space-y-5 pt-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-100 text-xs">
                <div>
                  <span className="text-neutral-400 block">Status</span>
                  <div className="mt-1">{getStatusTag(selectedOrder.orderStatus)}</div>
                </div>
                <div>
                  <span className="text-neutral-400 block">Payment Method</span>
                  <span className="font-semibold uppercase text-neutral-800 mt-1 block">
                    {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus || "pending"})
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Date</span>
                  <span className="font-semibold text-neutral-800 mt-1 block">
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleDateString()
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
                    <div key={idx} className="flex items-center justify-between p-3 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center font-bold text-neutral-400 text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900">{item.name}</div>
                          <div className="text-xs text-neutral-500">
                            Quantity: {item.quantity} × Tk {(item.price || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-neutral-900">
                        Tk {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
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
                <span>Total Amount Paid</span>
                <span>
                  Tk{" "}
                  {(
                    selectedOrder.finalAmount || selectedOrder.totalAmount || 0
                  ).toLocaleString("en-BD")}
                  .00
                </span>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AntdProvider>
  );
}
