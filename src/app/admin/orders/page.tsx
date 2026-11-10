"use client";

import React, { useState } from "react";
import {
  Table,
  Button,
  Drawer,
  Tag,
  Space,
  Typography,
  Card,
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
} from "@ant-design/icons";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  IOrder,
} from "@/redux/service/orderApi";
import {
  getOrderAmount,
  getOrderDiscount,
  getOrderStatus,
  getOrderSubtotal,
  getPaymentMethod,
  getPaymentStatus,
} from "@/lib/orderUtils";

const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // RTK Query & Mutation
  const { data: ordersData, isLoading, isFetching, refetch } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const ordersList: IOrder[] = ordersData?.data || [];

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
    <div>
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0 }}>
          Order Management
        </Title>
        <Text type="secondary">
          Track customer purchases, update fulfillment stages, and review shipping details.
        </Text>
      </div>

      {/* Filter Card */}
      <Card bodyStyle={{ padding: "16px 20px" }} style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
          <Space wrap>
            <Input
              placeholder="Search by Order ID, Name, Phone..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 280 }}
              allowClear
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 160 }}
            >
              <Option value="ALL">All Statuses</Option>
              <Option value="pending">Pending</Option>
              <Option value="processing">Processing</Option>
              <Option value="shipped">Shipped</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Space>

          <Space>
            <Text type="secondary">
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
        </Space>
      </Card>

      {/* Order Table */}
      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: 880 }}
        pagination={{
          defaultPageSize: 8,
          pageSizeOptions: ["8", "16", "24", "50"],
          showSizeChanger: true,
          showQuickJumper: true,
          responsive: true,
          showTotal: (total, range) => (
            <span style={{ fontSize: 13, color: "#595959" }}>
              Showing <strong>{range[0]}-{range[1]}</strong> of <strong>{total}</strong> orders
            </span>
          ),
          position: ["bottomRight"],
          style: { marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 },
        }}
      />

      {/* Order Detail Drawer */}
      <Drawer
        title={selectedOrder ? `Order #${selectedOrder.orderNumber || selectedOrder._id.slice(-6).toUpperCase()}` : "Order Details"}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width="min(95vw, 560px)"
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

            <Descriptions title="Customer Information" bordered size="small" column={1}>
              <Descriptions.Item label="Name">{selectedOrder.customer?.name}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedOrder.customer?.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedOrder.customer?.email}</Descriptions.Item>
              <Descriptions.Item label="Delivery Address">
                {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}
                {selectedOrder.shippingAddress?.postalCode ? ` - ${selectedOrder.shippingAddress?.postalCode}` : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Details">
                {getPaymentTag(getPaymentStatus(selectedOrder))} via {getPaymentMethod(selectedOrder).toUpperCase()}
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
    </div>
  );
}
