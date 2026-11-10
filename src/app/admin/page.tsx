"use client";

import React, { useState } from "react";
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
  Alert,
  Modal,
  Descriptions,
  Divider,
  Empty,
  Tooltip,
} from "antd";
import {
  ShoppingOutlined,
  OrderedListOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  UserOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  StarOutlined,
  EyeOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useGetAdminOverviewQuery } from "@/redux/service/adminApi";
import { useGetProductsQuery } from "@/redux/service/productApi";
import { useGetAllOrdersQuery } from "@/redux/service/orderApi";
import { useGetAdminReviewsQuery } from "@/redux/service/reviewApi";
import {
  getOrderAmount,
  getOrderStatus,
  getPaymentMethod,
  getPaymentStatus,
} from "@/lib/orderUtils";

const { Title, Text } = Typography;

export default function AdminDashboardPage() {
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isFetching: isOverviewFetching,
    isError: isOverviewError,
    refetch: refetchOverview,
  } = useGetAdminOverviewQuery();
  const { data: productsData } = useGetProductsQuery({ limit: 50 });
  const { data: ordersData } = useGetAllOrdersQuery({ limit: 20 });
  const { data: pendingReviewsData } = useGetAdminReviewsQuery({
    status: "pending",
    limit: 5,
  });

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const overview = overviewData?.data;
  const recentOrdersList = overview?.recentOrders || ordersData?.data || [];
  const allOrders = ordersData?.data || recentOrdersList;
  const productsList = productsData?.data || [];

  const totalProducts =
    overview?.totalProducts ?? productsData?.meta?.total ?? productsList.length;
  const totalOrders =
    overview?.totalOrders ?? ordersData?.meta?.total ?? allOrders.length;
  const totalRevenue = overview?.totalRevenue ?? 0;
  const totalUsers = overview?.totalUsers ?? 0;

  const monthlySales = overview?.monthlySales || [];
  const maxSale = Math.max(
    1,
    ...monthlySales.map((m) => Number(m.amount) || 0)
  );

  // Action queue metrics
  const pendingOrdersCount = allOrders.filter(
    (o: any) => getOrderStatus(o) === "pending"
  ).length;
  const lowStockCount = productsList.filter(
    (p: any) => typeof p.stock === "number" && p.stock <= 3
  ).length;
  const pendingReviewsCount =
    pendingReviewsData?.meta?.total ?? pendingReviewsData?.data?.length ?? 0;

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (id: string, record: any) => (
        <span style={{ fontWeight: 700, color: "#0f172a" }}>
          #{id || record._id?.slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            {record.customer?.name || record.customerName || "Customer"}
          </div>
          {record.customer?.phone && (
            <div style={{ fontSize: 11, color: "#64748b" }}>
              {record.customer.phone}
            </div>
          )}
        </div>
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
        return (
          <Tag color={color} style={{ textTransform: "capitalize" }}>
            {s}
          </Tag>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {date
            ? new Date(date).toLocaleDateString("en-BD", {
                month: "short",
                day: "numeric",
              })
            : "Today"}
        </Text>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => setSelectedOrder(record)}
          style={{ padding: 0 }}
        >
          Preview
        </Button>
      ),
    },
  ];

  const kpiCards = [
    {
      title: "Total Store Revenue",
      value: totalRevenue,
      prefix: "Tk ",
      subtitle: "View payment transactions",
      href: "/admin/payments",
      valueColor: "#059669",
      icon: <DollarOutlined />,
      iconBg: "#ecfdf5",
      iconColor: "#059669",
    },
    {
      title: "Total Customer Orders",
      value: totalOrders,
      prefix: undefined,
      subtitle: "Manage all orders",
      href: "/admin/orders",
      valueColor: "#0f172a",
      icon: <OrderedListOutlined />,
      iconBg: "#f0f9ff",
      iconColor: "#0284c7",
    },
    {
      title: "Catalog Products",
      value: totalProducts,
      prefix: undefined,
      subtitle: "Update products & inventory",
      href: "/admin/products",
      valueColor: "#0f172a",
      icon: <ShoppingOutlined />,
      iconBg: "#f8fafc",
      iconColor: "#334155",
    },
    {
      title: "Registered Accounts",
      value: totalUsers,
      prefix: undefined,
      subtitle: "View customer directory",
      href: "/admin/users",
      valueColor: "#0f172a",
      icon: <UserOutlined />,
      iconBg: "#fefce8",
      iconColor: "#ca8a04",
    },
  ];

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ display: "flex", width: "100%" }}
    >
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
            Store Operations Overview
          </Title>
          <Text type="secondary">
            Live metrics for products, incoming custom furniture orders, and
            payment collections.
          </Text>
        </div>

        <Space wrap>
          <Link href="/admin/products">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: "#09090b" }}
            >
              Add Product
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button icon={<OrderedListOutlined />}>Manage Orders</Button>
          </Link>
        </Space>
      </div>

      {isOverviewError && (
        <Alert
          type="warning"
          showIcon
          message="Could not fetch latest analytics overview."
          action={
            <Button
              size="small"
              loading={isOverviewFetching}
              onClick={() => refetchOverview()}
            >
              Retry
            </Button>
          }
        />
      )}

      {/* Clickable KPI Statistic Cards */}
      <Row gutter={[16, 16]}>
        {kpiCards.map((kpi) => (
          <Col xs={24} sm={12} lg={6} key={kpi.title}>
            <Link href={kpi.href} style={{ display: "block" }}>
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  height: "100%",
                }}
                styles={{ body: { padding: 20 } }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <Statistic
                    title={
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>
                        {kpi.title}
                      </span>
                    }
                    value={kpi.value}
                    prefix={kpi.prefix}
                    valueStyle={{
                      color: kpi.valueColor,
                      fontWeight: 700,
                      fontSize: 24,
                    }}
                    loading={isOverviewLoading}
                  />
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: kpi.iconBg,
                      color: kpi.iconColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {kpi.icon}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 12,
                    color: "#0284c7",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span>{kpi.subtitle}</span>
                  <ArrowRightOutlined style={{ fontSize: 11 }} />
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Revenue Chart + Pending Action Queue */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={15}>
          <Card
            title={
              <Space>
                <BarChartOutlined style={{ color: "#0284c7" }} />
                <span style={{ fontWeight: 600 }}>Monthly Sales Overview</span>
              </Space>
            }
            extra={
              <Text type="secondary" style={{ fontSize: 12 }}>
                BDT Collections
              </Text>
            }
            style={{ borderRadius: 12, border: "1px solid #e2e8f0", height: "100%" }}
          >
            {monthlySales.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Monthly revenue chart will appear once orders are recorded."
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 12,
                  height: 210,
                  padding: "16px 8px 4px",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                {monthlySales.map((m, idx) => {
                  const amt = Number(m.amount) || 0;
                  const heightPct = Math.max(8, Math.round((amt / maxSale) * 100));
                  return (
                    <Tooltip
                      key={`${m.month}-${idx}`}
                      title={`${m.month}: Tk ${amt.toLocaleString("en-BD")}`}
                    >
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          height: "100%",
                          gap: 8,
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: "#475569",
                            fontWeight: 600,
                          }}
                        >
                          {amt > 0
                            ? `${Math.round(amt / 1000)}k`
                            : "0"}
                        </span>
                        <div
                          style={{
                            width: "100%",
                            maxWidth: 42,
                            height: `${heightPct}%`,
                            borderRadius: "8px 8px 4px 4px",
                            background:
                              "linear-gradient(180deg, #0ea5e9 0%, #0284c7 100%)",
                            transition: "all 0.25s ease",
                          }}
                        />
                        <span
                          style={{
                            fontSize: 11,
                            color: "#64748b",
                            fontWeight: 500,
                          }}
                        >
                          {m.month}
                        </span>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            title={<span style={{ fontWeight: 600 }}>Needs Attention</span>}
            style={{ borderRadius: 12, border: "1px solid #e2e8f0", height: "100%" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link href="/admin/orders" style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: pendingOrdersCount > 0 ? "#fffbeb" : "#f8fafc",
                    border:
                      pendingOrdersCount > 0
                        ? "1px solid #fde68a"
                        : "1px solid #e2e8f0",
                  }}
                >
                  <Space>
                    <ClockCircleOutlined
                      style={{
                        color: pendingOrdersCount > 0 ? "#d97706" : "#64748b",
                        fontSize: 18,
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 13 }}>
                        Pending Orders
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        Awaiting confirmation &amp; CNC fabrication
                      </div>
                    </div>
                  </Space>
                  <Tag color={pendingOrdersCount > 0 ? "gold" : "default"}>
                    {pendingOrdersCount}
                  </Tag>
                </div>
              </Link>

              <Link href="/admin/products" style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: lowStockCount > 0 ? "#fef2f2" : "#f8fafc",
                    border:
                      lowStockCount > 0
                        ? "1px solid #fecaca"
                        : "1px solid #e2e8f0",
                  }}
                >
                  <Space>
                    <WarningOutlined
                      style={{
                        color: lowStockCount > 0 ? "#dc2626" : "#64748b",
                        fontSize: 18,
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 13 }}>
                        Low Stock Alerts
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        Products with 3 or fewer units left
                      </div>
                    </div>
                  </Space>
                  <Tag color={lowStockCount > 0 ? "red" : "default"}>
                    {lowStockCount}
                  </Tag>
                </div>
              </Link>

              <Link href="/admin/reviews" style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: pendingReviewsCount > 0 ? "#f0f9ff" : "#f8fafc",
                    border:
                      pendingReviewsCount > 0
                        ? "1px solid #bae6fd"
                        : "1px solid #e2e8f0",
                  }}
                >
                  <Space>
                    <StarOutlined
                      style={{
                        color: pendingReviewsCount > 0 ? "#0284c7" : "#64748b",
                        fontSize: 18,
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 13 }}>
                        Reviews to Moderate
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        Customer feedback pending approval
                      </div>
                    </div>
                  </Space>
                  <Tag color={pendingReviewsCount > 0 ? "blue" : "default"}>
                    {pendingReviewsCount}
                  </Tag>
                </div>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Section */}
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 600 }}>Recent Customer Orders</span>
            <Link
              href="/admin/orders"
              style={{ fontSize: 13, color: "#0284c7", fontWeight: 500 }}
            >
              View all orders <ArrowRightOutlined />
            </Link>
          </div>
        }
        style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
      >
        <Table
          dataSource={recentOrdersList}
          columns={columns}
          rowKey={(r) => r._id || r.id || Math.random().toString()}
          pagination={false}
          loading={isOverviewLoading}
          scroll={{ x: 750 }}
          locale={{ emptyText: "No customer orders placed yet." }}
        />
      </Card>

      {/* Quick Order Preview Modal */}
      <Modal
        title={
          selectedOrder
            ? `Order #${
                selectedOrder.orderNumber ||
                selectedOrder._id?.slice(-6).toUpperCase()
              }`
            : "Order Preview"
        }
        open={Boolean(selectedOrder)}
        onCancel={() => setSelectedOrder(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedOrder(null)}>
            Close
          </Button>,
          <Link key="manage" href="/admin/orders">
            <Button type="primary" style={{ background: "#09090b" }}>
              Update Status in Orders
            </Button>
          </Link>,
        ]}
        width={560}
      >
        {selectedOrder && (
          <div style={{ marginTop: 12 }}>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Customer">
                {selectedOrder.customer?.name || "Customer"} (
                {selectedOrder.customer?.phone ||
                  selectedOrder.customer?.email ||
                  "N/A"}
                )
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color="blue" style={{ textTransform: "capitalize" }}>
                  {getOrderStatus(selectedOrder)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment">
                {getPaymentMethod(selectedOrder).toUpperCase()} •{" "}
                {getPaymentStatus(selectedOrder).toUpperCase()}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <strong>
                  Tk {getOrderAmount(selectedOrder).toLocaleString("en-BD")}
                </strong>
              </Descriptions.Item>
              {selectedOrder.shippingAddress && (
                <Descriptions.Item label="Delivery Address">
                  {selectedOrder.shippingAddress.street},{" "}
                  {selectedOrder.shippingAddress.city}
                </Descriptions.Item>
              )}
            </Descriptions>

            {Array.isArray(selectedOrder.items) &&
              selectedOrder.items.length > 0 && (
                <>
                  <Divider style={{ margin: "14px 0" }} />
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>
                    Items ({selectedOrder.items.length})
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {selectedOrder.items.map((item: any, i: number) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          background: "#f8fafc",
                          borderRadius: 6,
                          fontSize: 13,
                        }}
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <strong>
                          Tk{" "}
                          {(
                            (item.price || 0) * (item.quantity || 1)
                          ).toLocaleString("en-BD")}
                        </strong>
                      </div>
                    ))}
                  </div>
                </>
              )}
          </div>
        )}
      </Modal>
    </Space>
  );
}
