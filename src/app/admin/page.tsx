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
  Spin,
} from "antd";
import {
  ShoppingOutlined,
  OrderedListOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useGetAdminOverviewQuery } from "@/redux/service/adminApi";
import { useGetProductsQuery } from "@/redux/service/productApi";
import { useGetAllOrdersQuery } from "@/redux/service/orderApi";
import {
  getOrderAmount,
  getOrderStatus,
  getPaymentMethod,
} from "@/lib/orderUtils";

const { Title, Text } = Typography;

export default function AdminDashboardPage() {
  const { data: overviewData, isLoading: isOverviewLoading } = useGetAdminOverviewQuery();
  const { data: productsData } = useGetProductsQuery({ limit: 10 });
  const { data: ordersData } = useGetAllOrdersQuery({ limit: 8 });

  const overview = overviewData?.data;
  const recentOrdersList = overview?.recentOrders || ordersData?.data || [];
  const totalProducts = overview?.totalProducts ?? (productsData?.meta?.total ?? productsData?.data?.length ?? 6);
  const totalOrders = overview?.totalOrders ?? (ordersData?.meta?.total ?? ordersData?.data?.length ?? 0);
  const totalRevenue = overview?.totalRevenue ?? 0;
  const totalUsers = overview?.totalUsers ?? 2;

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (id: string, record: any) => (
        <span style={{ fontWeight: 700 }}>#{id || record._id?.slice(-6).toUpperCase()}</span>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_: any, record: any) => (
        <span>{record.customer?.name || record.customerName || "Customer"}</span>
      ),
    },
    {
      title: "Amount (BDT)",
      key: "amount",
      render: (_: any, record: any) => (
        <span style={{ fontWeight: 600 }}>
          Tk {getOrderAmount(record).toLocaleString("en-BD")}
        </span>
      ),
    },
    {
      title: "Payment",
      key: "method",
      render: (_: any, record: any) => (
        <Tag color="blue" style={{ textTransform: "uppercase" }}>
          {getPaymentMethod(record)}
        </Tag>
      ),
    },
    {
      title: "Fulfillment",
      key: "status",
      render: (_: any, record: any) => {
        const s = getOrderStatus(record);
        const color =
          s === "delivered"
            ? "green"
            : s === "shipped"
            ? "purple"
            : s === "processing"
            ? "cyan"
            : s === "cancelled"
            ? "red"
            : "gold";
        return <Tag color={color} style={{ textTransform: "capitalize" }}>{s}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Text type="secondary">
          {date ? new Date(date).toLocaleDateString("en-BD", { month: "short", day: "numeric" }) : "Today"}
        </Text>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ display: "flex", width: "100%" }}>
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
              value={totalRevenue}
              prefix="Tk "
              valueStyle={{ color: "#3f8600", fontWeight: 700 }}
              loading={isOverviewLoading}
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
              value={totalOrders}
              prefix={<OrderedListOutlined />}
              valueStyle={{ color: "#09090b", fontWeight: 700 }}
              loading={isOverviewLoading}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Live customer orders
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered hoverable>
            <Statistic
              title="Catalog Products"
              value={totalProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#09090b", fontWeight: 700 }}
              loading={isOverviewLoading}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Active in inventory
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered hoverable>
            <Statistic
              title="Registered Accounts"
              value={totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#09090b", fontWeight: 700 }}
              loading={isOverviewLoading}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Admins & customer profiles
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Section */}
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 600 }}>Recent Customer Orders</span>
            <Link href="/admin/orders" style={{ fontSize: 13, color: "#1677ff", fontWeight: 500 }}>
              View all orders <ArrowRightOutlined />
            </Link>
          </div>
        }
        bordered
      >
        <Table
          dataSource={recentOrdersList}
          columns={columns}
          rowKey={(r) => r._id || r.id || Math.random().toString()}
          pagination={false}
          loading={isOverviewLoading}
          scroll={{ x: 700 }}
          locale={{ emptyText: "No customer orders placed yet." }}
        />
      </Card>
    </Space>
  );
}
