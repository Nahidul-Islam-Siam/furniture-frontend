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
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderDate: string;
  orderStatus: "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  paymentMethod: "bKash" | "Card" | "Nagad" | "COD";
}

const mockOrders: Order[] = [
  {
    id: "ORD-9421",
    customerName: "Rahim Chowdhury",
    phone: "+880 1712-345678",
    address: "House 42, Road 11, Banani",
    city: "Dhaka",
    items: [
      { id: "1", name: "GRID x Steelcase Leap (Pepper Black)", quantity: 1, price: 175000 },
    ],
    subtotal: 175000,
    deliveryFee: 500,
    total: 175500,
    orderDate: "2026-11-01 14:20",
    orderStatus: "Processing",
    paymentStatus: "Paid",
    paymentMethod: "bKash",
  },
  {
    id: "ORD-9420",
    customerName: "Tanvir Ahmed",
    phone: "+880 1819-876543",
    address: "Plot 15, Sector 4, Uttara",
    city: "Dhaka",
    items: [
      { id: "2", name: "Indie Motorized Standing Desk (140x70cm)", quantity: 1, price: 65000 },
      { id: "3", name: "Aeva Minimalist Single Lounge Chair", quantity: 1, price: 42000 },
    ],
    subtotal: 107000,
    deliveryFee: 500,
    total: 107500,
    orderDate: "2026-11-01 11:45",
    orderStatus: "Confirmed",
    paymentStatus: "Paid",
    paymentMethod: "Card",
  },
  {
    id: "ORD-9419",
    customerName: "Sadia Sultana",
    phone: "+880 1911-223344",
    address: "East Nasirabad, GEC Circle",
    city: "Chittagong",
    items: [
      { id: "4", name: "GRID x Steelcase Gesture Chair", quantity: 1, price: 195000 },
    ],
    subtotal: 195000,
    deliveryFee: 1500,
    total: 196500,
    orderDate: "2026-10-31 18:30",
    orderStatus: "Shipped",
    paymentStatus: "Paid",
    paymentMethod: "Card",
  },
  {
    id: "ORD-9418",
    customerName: "Mahmud Hasan",
    phone: "+880 1622-998877",
    address: "Dhanmondi 27, Apt 4B",
    city: "Dhaka",
    items: [
      { id: "5", name: "Modern Office Credenza / Storage Unit", quantity: 1, price: 48000 },
    ],
    subtotal: 48000,
    deliveryFee: 500,
    total: 48500,
    orderDate: "2026-10-31 09:15",
    orderStatus: "Pending",
    paymentStatus: "Pending",
    paymentMethod: "COD",
  },
  {
    id: "ORD-9417",
    customerName: "Farzana Yasmin",
    phone: "+880 1733-445566",
    address: "Sylhet Sadar, Zindabazar",
    city: "Sylhet",
    items: [
      { id: "6", name: "GRID Ergonomic Headrest Edition", quantity: 2, price: 54000 },
    ],
    subtotal: 108000,
    deliveryFee: 1500,
    total: 109500,
    orderDate: "2026-10-30 16:00",
    orderStatus: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Nagad",
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const handleStatusChange = (orderId: string, newStatus: Order["orderStatus"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
    }
    message.success(`Order ${orderId} marked as ${newStatus}`);
  };

  const getStatusTag = (status: Order["orderStatus"]) => {
    switch (status) {
      case "Pending":
        return <Tag color="gold" icon={<ClockCircleOutlined />}>Pending</Tag>;
      case "Confirmed":
        return <Tag color="blue">Confirmed</Tag>;
      case "Processing":
        return <Tag color="cyan">Processing</Tag>;
      case "Shipped":
        return <Tag color="purple" icon={<CarOutlined />}>Shipped</Tag>;
      case "Delivered":
        return <Tag color="green" icon={<CheckCircleOutlined />}>Delivered</Tag>;
      case "Cancelled":
        return <Tag color="red" icon={<CloseCircleOutlined />}>Cancelled</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getPaymentTag = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "Paid":
        return <Tag color="green">Paid</Tag>;
      case "Pending":
        return <Tag color="orange">Unpaid / COD</Tag>;
      case "Refunded":
        return <Tag color="volcano">Refunded</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchText.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      o.phone.includes(searchText);
    const matchesStatus = statusFilter === "ALL" || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id: string, record: Order) => (
        <a
          onClick={() => {
            setSelectedOrder(record);
            setIsDrawerOpen(true);
          }}
          style={{ fontWeight: 700, color: "#09090b" }}
        >
          #{id}
        </a>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      render: (name: string, record: Order) => (
        <div>
          <div style={{ fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "city",
      key: "city",
      render: (city: string) => <Tag>{city}</Tag>,
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      key: "total",
      render: (total: number) => (
        <span style={{ fontWeight: 700 }}>Tk {total.toLocaleString("en-BD")}</span>
      ),
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: Order["paymentStatus"], record: Order) => (
        <div>
          {getPaymentTag(status)}
          <span style={{ fontSize: 11, color: "#8c8c8c", marginLeft: 4 }}>
            ({record.paymentMethod})
          </span>
        </div>
      ),
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status: Order["orderStatus"]) => getStatusTag(status),
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date: string) => <span style={{ fontSize: 12, color: "#595959" }}>{date}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Order) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
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
              <Option value="Pending">Pending</Option>
              <Option value="Confirmed">Confirmed</Option>
              <Option value="Processing">Processing</Option>
              <Option value="Shipped">Shipped</Option>
              <Option value="Delivered">Delivered</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Space>

          <Text type="secondary">
            Total Orders: <strong>{filteredOrders.length}</strong>
          </Text>
        </Space>
      </Card>

      {/* Order Table */}
      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey="id"
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
        title={selectedOrder ? `Order #${selectedOrder.id}` : "Order Details"}
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
                <Text strong>{selectedOrder.orderDate}</Text>
              </div>
              <Select
                value={selectedOrder.orderStatus}
                onChange={(val) => handleStatusChange(selectedOrder.id, val)}
                style={{ width: 140 }}
              >
                <Option value="Pending">Pending</Option>
                <Option value="Confirmed">Confirmed</Option>
                <Option value="Processing">Processing</Option>
                <Option value="Shipped">Shipped</Option>
                <Option value="Delivered">Delivered</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            </div>

            <Descriptions title="Customer Information" bordered size="small" column={1}>
              <Descriptions.Item label="Name">{selectedOrder.customerName}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedOrder.phone}</Descriptions.Item>
              <Descriptions.Item label="Delivery Address">
                {selectedOrder.address}, {selectedOrder.city}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Details">
                {getPaymentTag(selectedOrder.paymentStatus)} via {selectedOrder.paymentMethod}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>Items Ordered</Title>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {selectedOrder.items.map((item) => (
                <div
                  key={item.id}
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
                      Qty: {item.quantity} × Tk {item.price.toLocaleString("en-BD")}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    Tk {(item.price * item.quantity).toLocaleString("en-BD")}
                  </div>
                </div>
              ))}
            </div>

            <Divider />

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">Subtotal:</Text>
                <Text strong>Tk {selectedOrder.subtotal.toLocaleString("en-BD")}</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">Delivery Fee ({selectedOrder.city}):</Text>
                <Text strong>Tk {selectedOrder.deliveryFee.toLocaleString("en-BD")}</Text>
              </div>
              <Divider style={{ margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16 }}>
                <Text strong>Grand Total:</Text>
                <Text strong style={{ color: "#09090b", fontSize: 18 }}>
                  Tk {selectedOrder.total.toLocaleString("en-BD")}
                </Text>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
