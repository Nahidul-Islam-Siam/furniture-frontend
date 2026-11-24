"use client";

import React from "react";
import { Modal, Button, Tag, Divider } from "antd";
import { PrinterOutlined, CloseOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { IOrder } from "@/redux/service/orderApi";
import {
  getOrderAmount,
  getOrderSubtotal,
  getOrderDiscount,
  getOrderShippingFee,
  getOrderStatus,
  getPaymentMethod,
  getPaymentStatus,
  getPaymentTransactionId,
  getPaymentSenderNumber,
  getPaymentAdvanceAmount,
  getPaymentDueAmount,
} from "@/lib/orderUtils";

interface OrderInvoiceModalProps {
  order: IOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const orderNo = order.orderNumber || order._id.slice(-6).toUpperCase();
  const paymentStatus = getPaymentStatus(order);
  const paymentMethod = getPaymentMethod(order);
  const trxId = getPaymentTransactionId(order);
  const senderNumber = getPaymentSenderNumber(order);
  const advanceAmount = getPaymentAdvanceAmount(order);
  const dueAmount = getPaymentDueAmount(order);
  const totalAmount = getOrderAmount(order);
  const subtotal = getOrderSubtotal(order);
  const shippingFee = getOrderShippingFee(order);
  const discount = getOrderDiscount(order);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={780}
      centered
      className="invoice-modal-root"
      destroyOnClose
    >
      <div className="p-4 sm:p-6 print:p-0 text-neutral-900 bg-white" id="printable-invoice">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b-2 border-neutral-900 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase font-heading">
              Unique Engineering &amp; Furniture
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Precision Crafted Modern Ergonomic Furniture &amp; Interior Metalworks
            </p>
            <p className="text-[11px] text-neutral-400 mt-1 font-mono">
              Hotline: +880 1711-223344 | Email: orders@furniture.com | Dhaka, Bangladesh
            </p>
          </div>
          <div className="text-right sm:text-right">
            <span className="inline-block px-3 py-1 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-md">
              INVOICE / BILL
            </span>
            <div className="text-sm font-mono font-bold mt-1.5">#{orderNo}</div>
            <div className="text-[11px] text-neutral-500 font-mono">
              Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" }) : "-"}
            </div>
          </div>
        </div>

        {/* Customer & Billing Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-4 text-xs border-b border-neutral-100">
          <div>
            <div className="font-bold uppercase tracking-wider text-neutral-400 text-[10px] mb-1">
              Billed &amp; Shipped To:
            </div>
            <div className="font-bold text-sm text-neutral-900">
              {order.customer?.name || order.shippingAddress?.recipientName || "Valued Customer"}
            </div>
            <div className="text-neutral-600 mt-0.5">Phone: {order.customer?.phone || order.shippingAddress?.phone}</div>
            {order.customer?.email && (
              <div className="text-neutral-500">Email: {order.customer.email}</div>
            )}
            <div className="text-neutral-600 mt-1">
              Address: {order.shippingAddress?.street}, {order.shippingAddress?.city}
              {order.shippingAddress?.postalCode ? ` - ${order.shippingAddress.postalCode}` : ""}
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <div className="font-bold uppercase tracking-wider text-neutral-400 text-[10px] mb-1">
              Payment Summary:
            </div>
            <div>
              <span className="text-neutral-500">Method: </span>
              <span className="font-bold uppercase font-mono">{paymentMethod}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5">
              <span className="text-neutral-500">Status: </span>
              {paymentStatus === "paid" ? (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 rounded">
                  PAID
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-100 text-amber-800 rounded">
                  UNPAID / COD
                </span>
              )}
            </div>
            {trxId && (
              <div className="font-mono text-[11px]">
                <span className="text-neutral-500">TrxID: </span>
                <span className="font-bold text-neutral-800">{trxId}</span>
              </div>
            )}
            {senderNumber && (
              <div className="font-mono text-[11px]">
                <span className="text-neutral-500">Sender: </span>
                <span>{senderNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-200 text-neutral-600 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 font-bold">Item Description</th>
                <th className="py-2.5 font-bold text-center">Qty</th>
                <th className="py-2.5 font-bold text-right">Unit Price</th>
                <th className="py-2.5 font-bold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {order.items?.map((item, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/50">
                  <td className="py-2.5">
                    <span className="font-bold text-neutral-900 block">{item.name}</span>
                    {item.color && (
                      <span className="text-[10px] text-neutral-500">Color/Variant: {item.color}</span>
                    )}
                  </td>
                  <td className="py-2.5 text-center font-mono">{item.quantity}</td>
                  <td className="py-2.5 text-right font-mono">
                    Tk {item.price?.toLocaleString("en-BD")}
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold">
                    Tk {((item.price || 0) * (item.quantity || 1)).toLocaleString("en-BD")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Notes */}
        <div className="border-t border-neutral-200 pt-3 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="text-[11px] text-neutral-500 max-w-xs space-y-1">
            <div className="font-bold text-neutral-700">Delivery Instructions / Notes:</div>
            <p className="italic text-neutral-600 bg-neutral-50 p-2 rounded border border-neutral-100">
              {order.notes || "Standard White-Glove Dispatch & Inspection."}
            </p>
          </div>

          <div className="w-full sm:w-60 space-y-1.5 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal:</span>
              <span className="font-mono font-bold">Tk {subtotal.toLocaleString("en-BD")}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Delivery Fee:</span>
              <span className="font-mono font-bold">Tk {shippingFee.toLocaleString("en-BD")}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span className="font-mono font-bold">-Tk {discount.toLocaleString("en-BD")}</span>
              </div>
            )}
            <div className="border-t-2 border-neutral-900 pt-2 flex justify-between font-bold text-sm">
              <span>Total Payable:</span>
              <span className="font-mono text-base">Tk {totalAmount.toLocaleString("en-BD")}</span>
            </div>
            {advanceAmount > 0 && (
              <>
                <div className="flex justify-between text-amber-700 font-bold text-xs pt-1">
                  <span>Advance Received:</span>
                  <span className="font-mono">Tk {advanceAmount.toLocaleString("en-BD")}</span>
                </div>
                <div className="flex justify-between text-neutral-900 font-bold text-xs">
                  <span>Remaining Due (COD):</span>
                  <span className="font-mono">Tk {dueAmount.toLocaleString("en-BD")}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Signatures & Footer */}
        <div className="mt-8 pt-6 border-t border-dashed border-neutral-300 flex justify-between items-end text-[11px] text-neutral-500">
          <div>
            <div className="w-32 border-b border-neutral-400 mb-1"></div>
            <div>Customer Signature</div>
          </div>
          <div className="text-right">
            <div className="w-36 border-b border-neutral-400 mb-1 ml-auto"></div>
            <div>Authorized Factory Seal</div>
          </div>
        </div>

        {/* Modal Action Buttons (hidden during print) */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-end gap-2.5 print:hidden">
          <Button onClick={onClose} icon={<CloseOutlined />}>
            Close
          </Button>
          <Button
            type="primary"
            onClick={handlePrint}
            icon={<PrinterOutlined />}
            className="bg-neutral-900 hover:bg-black"
          >
            Print / Save PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};
