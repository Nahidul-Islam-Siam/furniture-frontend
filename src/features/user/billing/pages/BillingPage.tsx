"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Table, Tag, Button, Modal, Descriptions } from "antd";
import type { ColumnsType } from "antd/es/table";
import AntdProvider from "@/lib/antd/AntdProvider";
import {
  CreditCard,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useGetMyOrdersQuery, IOrder } from "@/redux/service/orderApi";
import { useAppSelector } from "@/redux";

export const BillingPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: ordersData, isLoading } = useGetMyOrdersQuery();
  const [selectedInvoice, setSelectedInvoice] = useState<IOrder | null>(null);

  const orders: IOrder[] = ordersData?.data || [];
  const paidOrders = orders.filter((o) => o.payment?.status === "paid");
  const totalSettled = paidOrders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);

  const getPaymentStatusTag = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "paid":
        return (
          <Tag color="green" className="flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3" /> Paid
          </Tag>
        );
      case "failed":
        return (
          <Tag color="red" className="flex items-center gap-1 w-fit">
            <AlertCircle className="w-3 h-3" /> Failed
          </Tag>
        );
      default:
        return (
          <Tag color="orange" className="flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" /> Pending (COD)
          </Tag>
        );
    }
  };

  const columns: ColumnsType<IOrder> = [
    {
      title: "Invoice #",
      key: "orderNumber",
      render: (_, record) => (
        <div>
          <span className="font-heading font-bold text-neutral-900 block">
            #{record.orderNumber || record._id.slice(-6).toUpperCase()}
          </span>
          <span className="text-[11px] text-neutral-400">
            {record.createdAt ? new Date(record.createdAt).toLocaleDateString("en-GB") : "—"}
          </span>
        </div>
      ),
    },
    {
      title: "Items",
      key: "items",
      render: (_, record) => (
        <span className="text-xs text-neutral-600 line-clamp-1 max-w-[200px]">
          {record.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
        </span>
      ),
    },
    {
      title: "Payment Channel",
      key: "paymentMethod",
      render: (_, record) => (
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-700">
          {record.payment?.method === "sslcommerz" ? "SSLCommerz Online" : "Cash on Delivery (COD)"}
        </span>
      ),
    },
    {
      title: "Total Amount",
      key: "total",
      render: (_, record) => (
        <span className="font-heading font-bold text-neutral-900">
          Tk {(record.pricing?.total || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Payment Status",
      key: "status",
      render: (_, record) => getPaymentStatusTag(record.payment?.status || record.status),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => setSelectedInvoice(record)}
          className="text-primary font-semibold p-0 flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5" /> View Receipt
        </Button>
      ),
    },
  ];

  return (
    <AntdProvider>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold tracking-tight text-neutral-900">
              Billing & Invoices
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Review transaction receipts, payment channels, and downloadable invoices for your furniture orders.
            </p>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-colors w-fit shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm space-y-2">
            <span className="text-xs text-neutral-500 font-medium">Total Paid (Online)</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-heading font-bold text-emerald-600">
                Tk {totalSettled.toLocaleString()}
              </span>
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-neutral-400">Verified via SSLCommerz gateway</p>
          </div>

          <div className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm space-y-2">
            <span className="text-xs text-neutral-500 font-medium">Total Invoices</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-heading font-bold text-neutral-900">
                {orders.length}
              </span>
              <div className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-neutral-400">Including online & COD orders</p>
          </div>

          <div className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm space-y-2">
            <span className="text-xs text-neutral-500 font-medium">Payment Protection</span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-neutral-900">100% Encrypted</span>
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-neutral-400">SSL 256-bit bank encryption</p>
          </div>
        </div>

        {/* Accepted Payment Channels Banner */}
        <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-neutral-700 shrink-0" />
            <div>
              <span className="font-bold text-neutral-900">Accepted Payment Methods: </span>
              <span className="text-neutral-600">
                Visa, MasterCard, bKash, Nagad, Rocket, Upay & Cash on Delivery (COD).
              </span>
            </div>
          </div>
          <span className="text-[11px] text-neutral-400 font-medium">
            Powered by SSLCommerz
          </span>
        </div>

        {/* Invoices Table */}
        <div className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="font-heading font-semibold text-base text-neutral-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-neutral-500" /> Order Invoice History
            </h3>
            <span className="text-xs text-neutral-400">Live statements from database</span>
          </div>

          <Table
            dataSource={orders}
            columns={columns}
            rowKey="_id"
            loading={isLoading}
            pagination={{ defaultPageSize: 8, showSizeChanger: true }}
            scroll={{ x: 750 }}
            locale={{
              emptyText: (
                <div className="py-12 text-center text-neutral-500 space-y-2">
                  <p className="text-sm font-medium">No billing statements available yet.</p>
                  <Link
                    href="/collections"
                    className="text-primary hover:underline text-xs font-semibold inline-block"
                  >
                    Browse GRID Furniture catalog & place an order
                  </Link>
                </div>
              ),
            }}
          />
        </div>

        {/* Invoice Detail Modal */}
        <Modal
          title={
            <div className="flex items-center justify-between pr-6">
              <span className="font-heading font-bold text-base">
                Invoice #{selectedInvoice?.orderNumber || selectedInvoice?._id}
              </span>
              {selectedInvoice && getPaymentStatusTag(selectedInvoice.payment?.status || selectedInvoice.status)}
            </div>
          }
          open={!!selectedInvoice}
          onCancel={() => setSelectedInvoice(null)}
          footer={[
            <Button key="close" onClick={() => setSelectedInvoice(null)}>
              Close
            </Button>,
            <Button
              key="print"
              type="primary"
              onClick={() => window.print()}
              className="bg-black text-white hover:bg-neutral-800"
            >
              Print / Save PDF
            </Button>,
          ]}
          width={650}
        >
          {selectedInvoice && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-neutral-900">GRID Furniture Bangladesh</div>
                  <div className="text-neutral-500 text-[11px]">House 111, Road 8, Block C, Banani, Dhaka</div>
                </div>
                <div className="text-right">
                  <div className="text-neutral-400 text-[11px]">Date Issued</div>
                  <div className="font-bold text-neutral-900">
                    {selectedInvoice.createdAt
                      ? new Date(selectedInvoice.createdAt).toLocaleDateString("en-GB")
                      : "—"}
                  </div>
                </div>
              </div>

              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="Customer Name">
                  {selectedInvoice.customer?.name}
                </Descriptions.Item>
                <Descriptions.Item label="Customer Phone">
                  {selectedInvoice.customer?.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Delivery Address">
                  {selectedInvoice.shippingAddress?.street}, {selectedInvoice.shippingAddress?.city} -{" "}
                  {selectedInvoice.shippingAddress?.postalCode}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Channel">
                  {selectedInvoice.payment?.method?.toUpperCase() || "COD"}
                </Descriptions.Item>
                <Descriptions.Item label="Transaction ID">
                  {selectedInvoice.payment?.transactionId || "N/A (Cash on Delivery)"}
                </Descriptions.Item>
              </Descriptions>

              {/* Items Summary */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b">
                    <tr>
                      <th className="p-2.5">Item Description</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Price</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium">{item.name}</td>
                        <td className="p-2.5 text-center">{item.quantity}</td>
                        <td className="p-2.5 text-right">Tk {item.price.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-bold">
                          Tk {(item.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-neutral-50/70 border-t font-semibold">
                    <tr>
                      <td colSpan={3} className="p-2.5 text-right text-neutral-600">Shipping Fee:</td>
                      <td className="p-2.5 text-right">
                        Tk {(selectedInvoice.pricing?.shippingFee || 0).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="p-2.5 text-right text-base font-bold text-neutral-900">
                        Grand Total:
                      </td>
                      <td className="p-2.5 text-right text-base font-bold text-neutral-900">
                        Tk {(selectedInvoice.pricing?.total || 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AntdProvider>
  );
};

export default BillingPage;
