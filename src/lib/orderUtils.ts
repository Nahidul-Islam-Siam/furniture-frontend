import type { IOrder } from "@/redux/service/orderApi";

export function getOrderAmount(order: Partial<IOrder> | any): number {
  if (!order) return 0;
  return (
    order.pricing?.total ??
    order.finalAmount ??
    order.totalAmount ??
    order.amount ??
    0
  );
}

export function getOrderSubtotal(order: Partial<IOrder> | any): number {
  if (!order) return 0;
  return order.pricing?.subtotal ?? order.totalAmount ?? getOrderAmount(order);
}

export function getOrderDiscount(order: Partial<IOrder> | any): number {
  if (!order) return 0;
  return order.pricing?.discount ?? order.discountAmount ?? 0;
}

export function getOrderShippingFee(order: Partial<IOrder> | any): number {
  if (!order) return 0;
  return order.pricing?.shippingFee ?? 0;
}

export function getOrderStatus(order: Partial<IOrder> | any): string {
  if (!order) return "pending";
  return (order.status || order.orderStatus || "pending").toLowerCase();
}

export function getPaymentMethod(order: Partial<IOrder> | any): string {
  if (!order) return "cod";
  return (order.payment?.method || order.paymentMethod || "cod").toLowerCase();
}

export function getPaymentStatus(order: Partial<IOrder> | any): string {
  if (!order) return "pending";
  return (order.payment?.status || order.paymentStatus || "pending").toLowerCase();
}

export function getPaymentTransactionId(order: Partial<IOrder> | any): string {
  if (!order) return "";
  return order.payment?.transactionId || "";
}

export function getPaymentSenderNumber(order: Partial<IOrder> | any): string {
  if (!order) return "";
  return order.payment?.senderNumber || "";
}

export function getPaymentAdvanceAmount(order: Partial<IOrder> | any): number {
  if (!order) return 0;
  return order.payment?.advanceAmount ?? 0;
}

export function getPaymentDueAmount(order: Partial<IOrder> | any): number {
  if (!order) return 0;
  if (order.payment?.dueAmount !== undefined) return order.payment.dueAmount;
  const total = getOrderAmount(order);
  const advance = getPaymentAdvanceAmount(order);
  return Math.max(0, total - advance);
}

