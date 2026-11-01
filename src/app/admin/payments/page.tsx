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
} from "antd";
import {
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

export interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  amount: number;
  method: "bKash" | "Nagad" | "Card" | "COD" | "Bank Transfer";
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  timestamp: string;
  transactionRef: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-8849101",
    orderId: "ORD-9421",
    customerName: "Rahim Chowdhury",
    phone: "+880 1712-345678",
    amount: 175500,
    method: "bKash",
    status: "Completed",
    timestamp: "2026-11-01 14:22",
    transactionRef: "BKH920491823",
  },
  {
    id: "TXN-8849102",
    orderId: "ORD-9420",
    customerName: "Tanvir Ahmed",
    phone: "+880 1819-876543",
    amount: 107500,
    method: "Card",
    status: "Completed",
    timestamp: "2026-11-01 11:47",
    transactionRef: "AUTH_CARD_99210",
  },
  {
    id: "TXN-8849103",
    orderId: "ORD-9419",
    customerName: "Sadia Sultana",
    phone: "+880 1911-223344",
    amount: 196500,
    method: "Card",
    status: "Completed",
    timestamp: "2026-10-31 18:32",
    transactionRef: "AUTH_CARD_99201",
  },
  {
    id: "TXN-8849104",
    orderId: "ORD-9418",
    customerName: "Mahmud Hasan",
    phone: "+880 1622-998877",
    amount: 48500,
    method: "COD",
    status: "Pending",
    timestamp: "2026-10-31 09:15",
    transactionRef: "COD_RECEIVABLE",
  },
  {
    id: "TXN-8849105",
    orderId: "ORD-9417",
    customerName: "Farzana Yasmin",
    phone: "+880 1733-445566",
    amount: 109500,
    method: "Nagad",
    status: "Completed",
    timestamp: "2026-10-30 16:05",
    transactionRef: "NGD83921049",
  },
];

export default function AdminPaymentsPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchText, setSearchText] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const getMethodTag = (method: Transaction["method"]) => {
    switch (method) {
      case "bKash":
        return <Tag color="#e2136e">bKash</Tag>;
      case "Nagad":
        return <Tag color="#f7941d">Nagad</Tag>;
      case "Card":
        return <Tag color="#1890ff">Credit/Debit Card</Tag>;
      case "COD":
        return <Tag color="#722ed1">Cash on Delivery</Tag>;
      default:
        return <Tag>{method}</Tag>;
    }
  };

  const getStatusTag = (status: Transaction["status"]) => {
    switch (status) {
      case "Completed":
        return <Tag color="green" icon={<CheckCircleOutlined />}>Completed</Tag>;
      case "Pending":
        return <Tag color="orange" icon={<ClockCircleOutlined />}>Pending</Tag>;
      case "Failed":
        return <Tag color="red" icon={<CloseCircleOutlined />}>Failed</Tag>;
      case "Refunded":
        return <Tag color="volcano">Refunded</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchText.toLowerCase()) ||
      t.orderId.toLowerCase().includes(searchText.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      t.transactionRef.toLowerCase().includes(searchText.toLowerCase());

    const matchesMethod = methodFilter === "ALL" || t.method === methodFilter;
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  const totalSettled = transactions
    .filter((t) => t.status === "Completed")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingAmount = transactions
    .filter((t) => t.status === "Pending")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      key: "id",
      render: (id: string, record: Transaction) => (
        <div>
          <div style={{ fontWeight: 700, color: "#09090b" }}>{id}</div>
          <div style={{ fontSize: 11, color: "#8c8c8c" }}>Ref: {record.transactionRef}</div>
        </div>
      ),
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (orderId: string) => <Tag color="default">#{orderId}</Tag>,
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      render: (name: string, record: Transaction) => (
        <div>
          <div style={{ fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "method",
      key: "method",
      render: (method: Transaction["method"]) => getMethodTag(method),
    },
    {
      title: "Amount (BDT)",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => (
        <span style={{ fontWeight: 700, fontSize: 14 }}>
          Tk {amount.toLocaleString("en-BD")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Transaction["status"]) => getStatusTag(status),
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (time: string) => <span style={{ fontSize: 12, color: "#595959" }}>{time}</span>,
    },
  ];

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0 }}>
          Payment & Transaction Reconciliation
        </Title>
        <Text type="secondary">
          Monitor payment receipts across bKash, Nagad, Credit Cards, and Cash on Delivery.
        </Text>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card bordered hoverable>
            <Statistic
              title="Total Settled Payments"
              value={totalSettled}
              prefix="Tk "
              valueStyle={{ color: "#3f8600", fontWeight: 700 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Successfully processed transactions
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card bordered hoverable>
            <Statistic
              title="Pending Receivable / COD"
              value={pendingAmount}
              prefix="Tk "
              valueStyle={{ color: "#faad14", fontWeight: 700 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Awaiting cash collection on delivery
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card bordered hoverable>
            <Statistic
              title="Settled Transactions"
              value={transactions.filter((t) => t.status === "Completed").length}
              suffix={`/ ${transactions.length}`}
              valueStyle={{ color: "#09090b", fontWeight: 700 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              100% gateway reconciliation rate
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card bodyStyle={{ padding: "16px 20px" }} style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
          <Space wrap>
            <Input
              placeholder="Search by ID, Order, Customer, Ref..."
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
              <Option value="ALL">All Methods</Option>
              <Option value="bKash">bKash</Option>
              <Option value="Nagad">Nagad</Option>
              <Option value="Card">Credit/Debit Card</Option>
              <Option value="COD">Cash on Delivery</Option>
            </Select>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value="ALL">All Statuses</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Failed">Failed</Option>
              <Option value="Refunded">Refunded</Option>
            </Select>
          </Space>

          <Text type="secondary">
            Transactions: <strong>{filteredTransactions.length}</strong>
          </Text>
        </Space>
      </Card>

      {/* Transaction Table */}
      <Table
        dataSource={filteredTransactions}
        columns={columns}
        rowKey="id"
        scroll={{ x: 800 }}
        pagination={{
          defaultPageSize: 8,
          pageSizeOptions: ["8", "16", "24", "50"],
          showSizeChanger: true,
          showQuickJumper: true,
          responsive: true,
          showTotal: (total, range) => (
            <span style={{ fontSize: 13, color: "#595959" }}>
              Showing <strong>{range[0]}-{range[1]}</strong> of <strong>{total}</strong> transactions
            </span>
          ),
          position: ["bottomRight"],
          style: { marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 },
        }}
      />
    </div>
  );
}
