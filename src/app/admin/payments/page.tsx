"use client";

import React, { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Select,
  Input,
  Button,
  Modal,
  Descriptions,
  Divider,
} from "antd";
import {
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  CreditCardOutlined,
  EyeOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useGetAllOrdersQuery, IOrder } from "@/redux/service/orderApi";

const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminPaymentsPage() {
  const { data: ordersData, isLoading } = useGetAllOrdersQuery();
  const [searchText, setSearchText] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedPayment, setSelectedPayment] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const orders: IOrder[] = ordersData?.data || [];

  const getMethodTag = (method: string) => {
    const m = (method || "").toLowerCase();
    switch (m) {
      case "sslcommerz":
        return <Tag color="#e2136e">SSLCommerz (bKash/Cards)</Tag>;
      case "stripe":
        return <Tag color="#1890ff">Stripe (International Cards)</Tag>;
      case "cod":
        return <Tag color="#722ed1">Cash on Delivery</Tag>;
      default:
        return <Tag color="blue">{method?.toUpperCase() || "COD"}</Tag>;
    }
  };

  const getStatusTag = (status: string) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "paid":
        return <Tag color="green" icon={<CheckCircleOutlined />}>Paid / Settled</Tag>;
      case "pending":
        return <Tag color="orange" icon={<ClockCircleOutlined />}>Pending Payment</Tag>;
      case "failed":
        return <Tag color="red" icon={<CloseCircleOutlined />}>Failed</Tag>;
      case "refunded":
        return <Tag color="volcano">Refunded</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const filteredOrders = orders.filter((o) => {
    const orderNo = o.orderNumber || o._id || "";
    const custName = o.customer?.name || "";
    const phone = o.customer?.phone || "";
    const method = (o.paymentMethod || "cod").toLowerCase();
    const status = (o.paymentStatus || "pending").toLowerCase();

    const matchesSearch =
      orderNo.toLowerCase().includes(searchText.toLowerCase()) ||
      custName.toLowerCase().includes(searchText.toLowerCase()) ||
      phone.includes(searchText);

    const matchesMethod = methodFilter === "ALL" || method === methodFilter.toLowerCase();
    const matchesStatus = statusFilter === "ALL" || status === statusFilter.toLowerCase();

    return matchesSearch && matchesMethod && matchesStatus;
  });

  const getOrderTotal = (o: IOrder) =>
    (o as any).pricing?.total || o.finalAmount || o.totalAmount || 0;

  const totalSettled = orders
    .filter((o) => (o.paymentStatus || "").toLowerCase() === "paid")
    .reduce((acc, curr) => acc + getOrderTotal(curr), 0);

  const pendingAmount = orders
    .filter((o) => (o.paymentStatus || "").toLowerCase() === "pending")
    .reduce((acc, curr) => acc + getOrderTotal(curr), 0);

  const totalRevenueAll = orders.reduce((acc, curr) => acc + getOrderTotal(curr), 0);

  const columns = [
    {
      title: "Transaction / Order Ref",
      key: "ref",
      render: (_: any, record: IOrder) => {
        const tranId =
          (record as any).payment?.transactionId ||
          `TXN-${record.orderNumber || record._id.slice(-6).toUpperCase()}`;
        return (
          <div>
            <div style={{ fontWeight: 700, color: "#09090b" }}>{tranId}</div>
            <div style={{ fontSize: 11, color: "#8c8c8c" }}>
              Order: #{record.orderNumber || record._id.slice(-6).toUpperCase()}
            </div>
          </div>
        );
      },
    },
    {
      title: "Customer Details",
      key: "customer",
      render: (_: any, record: IOrder) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.customer?.name || "Customer"}</div>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>
            {record.customer?.phone || record.customer?.email}
          </div>
        </div>
      ),
    },
    {
      title: "Channel / Gateway",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method: string) => getMethodTag(method),
    },
    {
      title: "Amount (BDT)",
      key: "amount",
      render: (_: any, record: IOrder) => (
        <span style={{ fontWeight: 700, fontSize: 14 }}>
          Tk {getOrderTotal(record).toLocaleString("en-BD")}
        </span>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span style={{ fontSize: 12, color: "#595959" }}>
          {date
            ? new Date(date).toLocaleDateString("en-BD", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"}
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
          onClick={() => {
            setSelectedPayment(record);
            setIsModalOpen(true);
          }}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0 }}>
          Payment & Transaction Log
        </Title>
        <Text type="secondary">
          Monitor incoming payments across SSLCommerz, Credit Cards, and Cash on Delivery.
        </Text>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}>
          <Card bordered hoverable>
            <Statistic
              title="Settled Revenue (Paid)"
              value={totalSettled}
              prefix="Tk "
              valueStyle={{ color: "#3f8600", fontWeight: 700 }}
              loading={isLoading}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Verified gateway & settled transactions
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered hoverable>
            <Statistic
              title="Pending Receivables (COD / Unpaid)"
              value={pendingAmount}
              prefix="Tk "
              valueStyle={{ color: "#fa8c16", fontWeight: 700 }}
              loading={isLoading}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Awaiting delivery collection
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered hoverable>
            <Statistic
              title="Total Transactions Volume"
              value={orders.length}
              prefix={<WalletOutlined />}
              valueStyle={{ color: "#09090b", fontWeight: 700 }}
              loading={isLoading}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Gross value: Tk {totalRevenueAll.toLocaleString("en-BD")}
            </Text>
          </Card>
        </Col>
      </Row>

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
              value={methodFilter}
              onChange={setMethodFilter}
              style={{ width: 170 }}
            >
              <Option value="ALL">All Payment Channels</Option>
              <Option value="sslcommerz">SSLCommerz</Option>
              <Option value="stripe">Stripe</Option>
              <Option value="cod">Cash on Delivery</Option>
            </Select>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 160 }}
            >
              <Option value="ALL">All Statuses</Option>
              <Option value="paid">Paid / Settled</Option>
              <Option value="pending">Pending</Option>
              <Option value="failed">Failed</Option>
              <Option value="refunded">Refunded</Option>
            </Select>
          </Space>

          <Text type="secondary">
            Showing <strong>{filteredOrders.length}</strong> transactions
          </Text>
        </Space>
      </Card>

      {/* Table */}
      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: 800 }}
        pagination={{
          defaultPageSize: 8,
          pageSizeOptions: ["8", "16", "24", "50"],
          showSizeChanger: true,
          showQuickJumper: true,
          responsive: true,
          showTotal: (total, range) => (
            <span style={{ fontSize: 13, color: "#595959" }}>
              Showing <strong>{range[0]}-{range[1]}</strong> of <strong>{total}</strong> records
            </span>
          ),
          position: ["bottomRight"],
          style: { marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 },
        }}
      />

      {/* Details Modal */}
      <Modal
        title={
          selectedPayment
            ? `Transaction Details - #${selectedPayment.orderNumber || selectedPayment._id.slice(-6).toUpperCase()}`
            : "Transaction Details"
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" type="primary" style={{ background: "#09090b" }} onClick={() => setIsModalOpen(false)}>
            Close
          </Button>,
        ]}
        width="min(95vw, 560px)"
      >
        {selectedPayment && (
          <div style={{ marginTop: 16 }}>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Order Number">
                #{selectedPayment.orderNumber || selectedPayment._id.slice(-6).toUpperCase()}
              </Descriptions.Item>
              <Descriptions.Item label="Customer">
                {selectedPayment.customer?.name} ({selectedPayment.customer?.phone})
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedPayment.customer?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Gateway">
                {getMethodTag(selectedPayment.paymentMethod)}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                {getStatusTag(selectedPayment.paymentStatus)}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                Tk {getOrderTotal(selectedPayment).toLocaleString("en-BD")}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Address">
                {selectedPayment.shippingAddress?.street}, {selectedPayment.shippingAddress?.city}
              </Descriptions.Item>
              <Descriptions.Item label="Order Placed At">
                {selectedPayment.createdAt
                  ? new Date(selectedPayment.createdAt).toLocaleString("en-BD")
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: "16px 0" }} />
            <Title level={5}>Ordered Items</Title>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selectedPayment.items?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 12px",
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
          </div>
        )}
      </Modal>
    </div>
  );
}
