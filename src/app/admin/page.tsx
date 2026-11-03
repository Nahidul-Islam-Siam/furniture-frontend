"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Tag,
  Typography,
  Space,
  Button,
} from "antd";
import {
  DollarOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface RecentOrder {
  key: string;
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered";
  method: string;
  time: string;
}

export default function AdminDashboardPage() {
  const recentOrders: RecentOrder[] = [
    {
      key: "1",
      id: "ORD-9421",
      customer: "Rahim Chowdhury",
      product: "GRID x Steelcase Leap (Black)",
      amount: 175500,
      status: "Processing",
      method: "bKash",
      time: "25m ago",
    },
    {
      key: "2",
      id: "ORD-9420",
      customer: "Tanvir Ahmed",
      product: "Indie Motorized Desk + Lounge",
      amount: 107500,
      status: "Processing",
      method: "Card",
      time: "3h ago",
    },
    {
      key: "3",
      id: "ORD-9419",
      customer: "Sadia Sultana",
      product: "GRID x Steelcase Gesture Chair",
      amount: 196500,
      status: "Shipped",
      method: "Card",
      time: "Yesterday",
    },
    {
      key: "4",
      id: "ORD-9418",
      customer: "Mahmud Hasan",
      product: "Modern Office Credenza",
      amount: 48500,
      status: "Pending",
      method: "COD",
      time: "Yesterday",
    },
    {
      key: "5",
      id: "ORD-9417",
      customer: "Farzana Yasmin",
      product: "GRID Ergonomic Headrest Edition",
      amount: 109500,
      status: "Delivered",
      method: "Nagad",
      time: "2 days ago",
    },
    {
      key: "6",
      id: "ORD-9416",
      customer: "Nafis Imtiaz",
      product: "Smart Ergonomic Dual-Motor Desk",
      amount: 82000,
      status: "Delivered",
      method: "bKash",
      time: "3 days ago",
    },
    {
      key: "7",
      id: "ORD-9415",
      customer: "Ayesha Siddiqua",
      product: "Minimalist Oak Storage Credenza",
      amount: 62000,
      status: "Delivered",
      method: "Card",
      time: "4 days ago",
    },
    {
      key: "8",
      id: "ORD-9414",
      customer: "Kamrul Islam",
      product: "Mesh Task Swivel Ergonomic Chair",
      amount: 38500,
      status: "Delivered",
      method: "COD",
      time: "5 days ago",
    },
  ];

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => <span style={{ fontWeight: 700 }}>#{id}</span>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Items",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Amount (BDT)",
      dataIndex: "amount",
      key: "amount",
      render: (amt: number) => (
        <span style={{ fontWeight: 600 }}>Tk {amt.toLocaleString("en-BD")}</span>
      ),
    },
    {
      title: "Payment",
      dataIndex: "method",
      key: "method",
      render: (method: string) => <Tag color="blue">{method}</Tag>,
    },
    {
      title: "Fulfillment",
      dataIndex: "status",
      key: "status",
      render: (status: RecentOrder["status"]) => {
        const color =
          status === "Delivered"
            ? "green"
            : status === "Shipped"
            ? "purple"
            : status === "Processing"
            ? "cyan"
            : "gold";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (time: string) => <Text type="secondary">{time}</Text>,
    },
  ];

  return (
    <Space direction="vertical" orientation="vertical" size="large" style={{ display: "flex" }}>
      {/* Welcome & Quick Action Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            E-Commerce Store Overview
          </Title>
          <Text type="secondary">
            Live overview of products, incoming customer orders, and payment collections.
          </Text>
        </div>

        <Space>
          <Link href="/admin/products">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: "#09090b" }}
            >
              Upload Product
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button icon={<OrderedListOutlined />}>View Orders</Button>
          </Link>
        </Space>
      </div>

      {/* KPI Statistic Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered hoverable>
            <Statistic
              title="Total Store Revenue"
              value={1425000}
              prefix="Tk "
              valueStyle={{ color: "#3f8600", fontWeight: 700 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Across all payment channels
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered hoverable>
            <Statistic
              title="Total Customer Orders"
              value={148}
              prefix={<OrderedListOutlined />}
              valueStyle={{ color: "#09090b", fontWeight: 700 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              98.2% fulfillment rate
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered hoverable>
            <Statistic
              title="Catalog Products"
              value={18}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#1890ff", fontWeight: 700 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Chairs, Tables, Sofas, Storage
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered hoverable>
            <Statistic
              title="Pending Fulfillment"
              value={4}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14", fontWeight: 700 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Orders awaiting packaging/delivery
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Section */}
      <Card
        title="Recent Customer Orders"
        extra={
          <Link href="/admin/orders" style={{ fontSize: 13, fontWeight: 600 }}>
            All Orders <ArrowRightOutlined />
          </Link>
        }
      >
        <Table
          dataSource={recentOrders}
          columns={columns}
          pagination={{
            defaultPageSize: 5,
            pageSizeOptions: ["5", "10", "20"],
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
          size="middle"
          scroll={{ x: 750 }}
        />
      </Card>
    </Space>
  );
}
