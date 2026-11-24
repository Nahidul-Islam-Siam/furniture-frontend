"use client";

import React, { useState } from "react";
import {
  Table,
  Button,
  Drawer,
  Tag,
  Space,
  Typography,
  Select,
  Descriptions,
  Divider,
  Input,
  message,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ReloadOutlined,
  PrinterOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderPaymentStatusMutation,
  IOrder,
} from "@/redux/service/orderApi";
import {
  getOrderAmount,
  getOrderDiscount,
  getOrderStatus,
  getOrderSubtotal,
  getPaymentMethod,
  getPaymentStatus,
  getPaymentTransactionId,
  getPaymentSenderNumber,
  getPaymentAdvanceAmount,
  getPaymentDueAmount,
} from "@/lib/orderUtils";
import { OrderInvoiceModal } from "@/components/invoice/OrderInvoiceModal";

const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updatingPaymentId, setUpdatingPaymentId] = useState<string | null>(null);

  // RTK Query & Mutation
  const { data: ordersData, isLoading, isFetching, refetch } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [updateOrderPaymentStatus] = useUpdateOrderPaymentStatusMutation();

  const ordersList: IOrder[] = ordersData?.data || [];

  const handlePaymentStatusChange = async (
    orderId: string,
    newPaymentStatus: "pending" | "paid" | "failed" | "refunded"
  ) => {
    setUpdatingPaymentId(orderId);
    try {
      await updateOrderPaymentStatus({
        id: orderId,
        status: newPaymentStatus,
      }).unwrap();
      message.success(`Payment marked as ${newPaymentStatus.toUpperCase()}`);
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                paymentStatus: newPaymentStatus,
                payment: {
                  ...prev.payment,
                  status: newPaymentStatus,
                  paidAt:
                    newPaymentStatus === "paid"
                      ? new Date().toISOString()
                      : prev.payment?.paidAt,
                } as any,
              }
            : null
        );
      }
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update payment status");
    } finally {
      setUpdatingPaymentId(null);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus({
        id: orderId,
        status: newStatus.toLowerCase(),
      }).unwrap();
      message.success(`Order status updated to ${newStatus}`);
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus.toLowerCase(),
                orderStatus: newStatus.toLowerCase() as any,
              }
            : null
        );
      }
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusTag = (status: string) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "pending":
        return <Tag color="gold" icon={<ClockCircleOutlined />}>Pending</Tag>;
      case "processing":
      case "confirmed":
        return <Tag color="cyan" icon={<SyncOutlined spin />}>Processing</Tag>;
      case "shipped":
        return <Tag color="purple" icon={<CarOutlined />}>Shipped</Tag>;
      case "delivered":
        return <Tag color="green" icon={<CheckCircleOutlined />}>Delivered</Tag>;
      case "cancelled":
        return <Tag color="red" icon={<CloseCircleOutlined />}>Cancelled</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getPaymentTag = (status: string) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "paid":
        return <Tag color="green">Paid</Tag>;
      case "pending":
        return <Tag color="orange">Unpaid / COD</Tag>;
      case "refunded":
        return <Tag color="volcano">Refunded</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const filteredOrders = ordersList.filter((o) => {
    const orderNo = o.orderNumber || o._id || "";
    const custName = o.customer?.name || "";
    const phone = o.customer?.phone || "";
    const matchesSearch =
      orderNo.toLowerCase().includes(searchText.toLowerCase()) ||
      custName.toLowerCase().includes(searchText.toLowerCase()) ||
      phone.includes(searchText);
    const matchesStatus =
      statusFilter === "ALL" ||
      getOrderStatus(o) === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (num: string, record: IOrder) => (
        <a
          onClick={() => {
            setSelectedOrder(record);
            setIsDrawerOpen(true);
          }}
          style={{ fontWeight: 700, color: "#09090b" }}
        >
          #{num || record._id.slice(-6).toUpperCase()}
        </a>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_: any, record: IOrder) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.customer?.name || "Customer"}</div>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.customer?.phone || record.customer?.email}</div>
        </div>
      ),
    },
    {
      title: "Location",
      key: "location",
      render: (_: any, record: IOrder) => (
        <Tag>{record.shippingAddress?.city || "Dhaka"}</Tag>
      ),
    },
    {
      title: "Total Amount",
      key: "finalAmount",
      render: (_: any, record: IOrder) => (
        <span style={{ fontWeight: 700 }}>
          Tk {getOrderAmount(record).toLocaleString("en-BD")}
        </span>
      ),
    },
    {
      title: "Payment",
      key: "payment",
      render: (_: any, record: IOrder) => (
        <div>
          {getPaymentTag(getPaymentStatus(record))}
          <span style={{ fontSize: 11, color: "#8c8c8c", marginLeft: 4, textTransform: "uppercase" }}>
            ({getPaymentMethod(record)})
          </span>
        </div>
      ),
    },
    {
      title: "Order Status",
      key: "orderStatus",
      render: (_: any, record: IOrder) => getStatusTag(getOrderStatus(record)),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span style={{ fontSize: 12, color: "#595959" }}>
          {date ? new Date(date).toLocaleDateString("en-BD", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: IOrder) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          loading={updatingOrderId === record._id}
          onClick={() => {
            setSelectedOrder(record);
            setIsDrawerOpen(true);
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <Title level={3} style={{ margin: 0, color: "#0f172a" }}>
          Order Management
        </Title>
        <Text type="secondary">
          Track customer purchases, update fulfillment stages, and review shipping details.
        </Text>
      </div>

      {/* Filter Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <Input
            placeholder="Search by Order ID, Name, Phone..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full sm:w-64"
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full sm:w-44"
          >
            <Option value="ALL">All Statuses</Option>
            <Option value="pending">Pending</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </div>

        <Space>
          <Text type="secondary" className="text-xs whitespace-nowrap">
            Total Orders: <strong>{filteredOrders.length}</strong>
          </Text>
          <Button
            size="small"
            icon={<ReloadOutlined />}
            loading={isFetching}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Order Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden">
        <Table
          dataSource={filteredOrders}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          scroll={{ x: 820 }}
          pagination={{
            defaultPageSize: 8,
            pageSizeOptions: ["8", "16", "24", "50"],
            showSizeChanger: true,
            showQuickJumper: true,
            responsive: true,
            showTotal: (total, range) => (
              <span className="text-xs text-slate-500">
                Showing <strong>{range[0]}-{range[1]}</strong> of{" "}
                <strong>{total}</strong> orders
              </span>
            ),
            position: ["bottomRight"],
            className: "px-4 pb-3",
          }}
        />
      </div>

      {/* Order Detail Drawer */}
      <Drawer
        title={
          selectedOrder ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", paddingRight: 24 }}>
              <span>Order #{selectedOrder.orderNumber || selectedOrder._id.slice(-6).toUpperCase()}</span>
              <Button
                type="primary"
                size="small"
                icon={<PrinterOutlined />}
                onClick={() => setIsInvoiceOpen(true)}
                className="bg-neutral-900 hover:bg-black"
              >
                Print Invoice
              </Button>
            </div>
          ) : (
            "Order Details"
          )
        }
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width="min(95vw, 620px)"
      >
        {selectedOrder && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <Text type="secondary">Placed On: </Text>
                <Text strong>
                  {selectedOrder.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleString("en-BD")
                    : "N/A"}
                </Text>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Delivery Status: </Text>
                <Select
                  value={getOrderStatus(selectedOrder)}
                  onChange={(val) => handleStatusChange(selectedOrder._id, val)}
                  loading={updatingOrderId === selectedOrder._id}
                  disabled={updatingOrderId === selectedOrder._id}
                  style={{ width: 140 }}
                >
                  <Option value="pending">Pending</Option>
                  <Option value="processing">Processing</Option>
                  <Option value="shipped">Shipped</Option>
                  <Option value="delivered">Delivered</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </div>
            </div>

            <Descriptions title="Customer & Delivery Information" bordered size="small" column={1}>
              <Descriptions.Item label="Name">{selectedOrder.customer?.name}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedOrder.customer?.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedOrder.customer?.email}</Descriptions.Item>
              <Descriptions.Item label="Delivery Address">
                {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}
                {selectedOrder.shippingAddress?.postalCode ? ` - ${selectedOrder.shippingAddress?.postalCode}` : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Notes">
                {selectedOrder.notes || "None"}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Details">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      {getPaymentTag(getPaymentStatus(selectedOrder))} via{" "}
                      <span style={{ fontWeight: 700, textTransform: "uppercase" }}>
                        {getPaymentMethod(selectedOrder)}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>Mark Status:</Text>
                      <Select
                        value={getPaymentStatus(selectedOrder)}
                        onChange={(val) =>
                          handlePaymentStatusChange(
                            selectedOrder._id,
                            val as "pending" | "paid" | "failed" | "refunded"
                          )
                        }
                        loading={updatingPaymentId === selectedOrder._id}
                        disabled={updatingPaymentId === selectedOrder._id}
                        size="small"
                        style={{ width: 120 }}
                      >
                        <Option value="pending">Pending</Option>
                        <Option value="paid">Paid</Option>
                        <Option value="failed">Failed</Option>
                        <Option value="refunded">Refunded</Option>
                      </Select>
                    </div>
                  </div>

                  {getPaymentTransactionId(selectedOrder) && (
                    <div style={{ fontSize: 12, background: "#f5f5f5", padding: "4px 8px", borderRadius: 4 }}>
                      <span style={{ color: "#666" }}>Transaction ID: </span>
                      <strong style={{ fontFamily: "monospace" }}>{getPaymentTransactionId(selectedOrder)}</strong>
                    </div>
                  )}

                  {getPaymentSenderNumber(selectedOrder) && (
                    <div style={{ fontSize: 12 }}>
                      <span style={{ color: "#666" }}>Sender Number: </span>
                      <strong style={{ fontFamily: "monospace" }}>{getPaymentSenderNumber(selectedOrder)}</strong>
                    </div>
                  )}

                  {getPaymentAdvanceAmount(selectedOrder) > 0 && (
                    <div style={{ fontSize: 12, color: "#b45309", background: "#fef3c7", padding: "4px 8px", borderRadius: 4 }}>
                      <span>Advance Received: <strong>Tk {getPaymentAdvanceAmount(selectedOrder).toLocaleString("en-BD")}</strong></span>
                      <span style={{ marginLeft: 10 }}>Due on Delivery: <strong>Tk {getPaymentDueAmount(selectedOrder).toLocaleString("en-BD")}</strong></span>
                    </div>
                  )}
                </div>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>Items Ordered</Title>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {selectedOrder.items?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: "#f9f9f9",
                    borderRadius: 6,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                      Qty: {item.quantity} × Tk {item.price?.toLocaleString("en-BD")}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    Tk {((item.price || 0) * (item.quantity || 1)).toLocaleString("en-BD")}
                  </div>
                </div>
              ))}
            </div>

            <Divider />

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">Subtotal:</Text>
                <Text strong>Tk {getOrderSubtotal(selectedOrder).toLocaleString("en-BD")}</Text>
              </div>
              {getOrderDiscount(selectedOrder) ? (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary">Discount:</Text>
                  <Text type="danger">-Tk {getOrderDiscount(selectedOrder).toLocaleString("en-BD")}</Text>
                </div>
              ) : null}
              <Divider style={{ margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16 }}>
                <Text strong>Grand Total:</Text>
                <Text strong style={{ color: "#09090b", fontSize: 18 }}>
                  Tk {getOrderAmount(selectedOrder).toLocaleString("en-BD")}
                </Text>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <OrderInvoiceModal
        order={selectedOrder}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
}
