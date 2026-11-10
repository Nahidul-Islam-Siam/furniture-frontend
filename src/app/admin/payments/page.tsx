"use client";

import React, { useState } from "react";
import {
  Table,
  Tag,
  Typography,
  Select,
  Input,
  Button,
  Modal,
  Descriptions,
  Divider,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  EyeOutlined,
  WalletOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useGetAllOrdersQuery, IOrder } from "@/redux/service/orderApi";
import {
  getOrderAmount,
  getPaymentMethod,
  getPaymentStatus,
  getPaymentTransactionId,
} from "@/lib/orderUtils";

const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminPaymentsPage() {
  const { data: ordersData, isLoading, isFetching, refetch } =
    useGetAllOrdersQuery();
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
        return <Tag color="#1890ff">Stripe (Cards)</Tag>;
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
        return (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Paid
          </Tag>
        );
      case "pending":
        return (
          <Tag color="orange" icon={<ClockCircleOutlined />}>
            Pending
          </Tag>
        );
      case "failed":
        return (
          <Tag color="red" icon={<CloseCircleOutlined />}>
            Failed
          </Tag>
        );
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
    const method = getPaymentMethod(o);
    const status = getPaymentStatus(o);

    const matchesSearch =
      orderNo.toLowerCase().includes(searchText.toLowerCase()) ||
      custName.toLowerCase().includes(searchText.toLowerCase()) ||
      phone.includes(searchText);

    const matchesMethod =
      methodFilter === "ALL" || method === methodFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "ALL" || status === statusFilter.toLowerCase();

    return matchesSearch && matchesMethod && matchesStatus;
  });

  const getOrderTotal = (o: IOrder) => getOrderAmount(o);

  const totalSettled = orders
    .filter((o) => getPaymentStatus(o) === "paid")
    .reduce((acc, curr) => acc + getOrderTotal(curr), 0);

  const pendingAmount = orders
    .filter((o) => getPaymentStatus(o) === "pending")
    .reduce((acc, curr) => acc + getOrderTotal(curr), 0);

  const totalRevenueAll = orders.reduce(
    (acc, curr) => acc + getOrderTotal(curr),
    0
  );

  const columns = [
    {
      title: "Transaction Ref",
      key: "ref",
      render: (_: any, record: IOrder) => {
        const tranId = getPaymentTransactionId(record);
        return (
          <div className="min-w-[130px]">
            <div className="font-semibold text-slate-900 text-xs">{tranId}</div>
            <div className="text-[11px] text-slate-500">
              #{record.orderNumber || record._id.slice(-6).toUpperCase()}
            </div>
          </div>
        );
      },
    },
    {
      title: "Customer",
      key: "customer",
      render: (_: any, record: IOrder) => (
        <div className="min-w-[140px]">
          <div className="font-semibold text-slate-900">
            {record.customer?.name || "Customer"}
          </div>
          <div className="text-xs text-slate-500">
            {record.customer?.phone || record.customer?.email}
          </div>
        </div>
      ),
    },
    {
      title: "Channel",
      key: "paymentMethod",
      render: (_: any, record: IOrder) => getMethodTag(getPaymentMethod(record)),
    },
    {
      title: "Amount",
      key: "amount",
      render: (_: any, record: IOrder) => (
        <span className="font-bold text-sm text-slate-900 whitespace-nowrap">
          Tk {getOrderTotal(record).toLocaleString("en-BD")}
        </span>
      ),
    },
    {
      title: "Status",
      key: "paymentStatus",
      render: (_: any, record: IOrder) => getStatusTag(getPaymentStatus(record)),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-xs text-slate-500 whitespace-nowrap">
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
      title: "Action",
      key: "actions",
      render: (_: any, record: IOrder) => (
        <Button
          type="link"
          size="small"
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
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Title level={3} style={{ margin: 0, color: "#0f172a" }}>
            Payment &amp; Transaction Log
          </Title>
          <Text type="secondary">
            Monitor incoming payments across SSLCommerz, Cards, and Cash on Delivery.
          </Text>
        </div>

        <Button
          icon={<ReloadOutlined />}
          loading={isFetching}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Settled Revenue
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircleOutlined />
            </span>
          </div>
          {isLoading ? (
            <div className="mt-3 h-7 w-28 rounded-md bg-slate-200 animate-pulse" />
          ) : (
            <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 whitespace-nowrap">
              Tk {totalSettled.toLocaleString("en-BD")}
            </div>
          )}
          <p className="mt-1 mb-0 text-[11px] text-slate-400">
            Verified gateway &amp; paid orders
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Pending Receivables
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <ClockCircleOutlined />
            </span>
          </div>
          {isLoading ? (
            <div className="mt-3 h-7 w-28 rounded-md bg-slate-200 animate-pulse" />
          ) : (
            <div className="mt-2 text-2xl font-bold tracking-tight text-amber-600 whitespace-nowrap">
              Tk {pendingAmount.toLocaleString("en-BD")}
            </div>
          )}
          <p className="mt-1 mb-0 text-[11px] text-slate-400">
            Cash on Delivery &amp; awaiting collection
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Total Transactions
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <WalletOutlined />
            </span>
          </div>
          {isLoading ? (
            <div className="mt-3 h-7 w-16 rounded-md bg-slate-200 animate-pulse" />
          ) : (
            <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {orders.length}
            </div>
          )}
          <p className="mt-1 mb-0 text-[11px] text-slate-400 whitespace-nowrap">
            Gross volume: Tk {totalRevenueAll.toLocaleString("en-BD")}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <Input
            placeholder="Search Order ID, Name, Phone..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full sm:w-64"
            allowClear
          />
          <Select
            value={methodFilter}
            onChange={setMethodFilter}
            className="w-full sm:w-44"
          >
            <Option value="ALL">All Channels</Option>
            <Option value="sslcommerz">SSLCommerz</Option>
            <Option value="stripe">Stripe</Option>
            <Option value="cod">Cash on Delivery</Option>
          </Select>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full sm:w-40"
          >
            <Option value="ALL">All Statuses</Option>
            <Option value="paid">Paid / Settled</Option>
            <Option value="pending">Pending</Option>
            <Option value="failed">Failed</Option>
            <Option value="refunded">Refunded</Option>
          </Select>
        </div>

        <Text type="secondary" className="text-xs whitespace-nowrap">
          Showing <strong>{filteredOrders.length}</strong> transactions
        </Text>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden">
        <Table
          dataSource={filteredOrders}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          scroll={{ x: 760 }}
          locale={{
            emptyText: (
              <div className="py-10 text-slate-400 text-sm">
                No payment transactions recorded yet.
              </div>
            ),
          }}
          pagination={{
            defaultPageSize: 8,
            pageSizeOptions: ["8", "16", "24", "50"],
            showSizeChanger: true,
            responsive: true,
            showTotal: (total, range) => (
              <span className="text-xs text-slate-500">
                Showing <strong>{range[0]}-{range[1]}</strong> of{" "}
                <strong>{total}</strong> records
              </span>
            ),
            className: "px-4 pb-3",
          }}
        />
      </div>

      {/* Details Modal */}
      <Modal
        title={
          selectedPayment
            ? `Transaction Details - #${
                selectedPayment.orderNumber ||
                selectedPayment._id.slice(-6).toUpperCase()
              }`
            : "Transaction Details"
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            key="close"
            type="primary"
            style={{ background: "#0f172a" }}
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </Button>,
        ]}
        width="min(95vw, 560px)"
      >
        {selectedPayment && (
          <div style={{ marginTop: 16 }}>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Order Number">
                #
                {selectedPayment.orderNumber ||
                  selectedPayment._id.slice(-6).toUpperCase()}
              </Descriptions.Item>
              <Descriptions.Item label="Customer">
                {selectedPayment.customer?.name} (
                {selectedPayment.customer?.phone})
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedPayment.customer?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Gateway">
                {getMethodTag(getPaymentMethod(selectedPayment))}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                {getStatusTag(getPaymentStatus(selectedPayment))}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                Tk {getOrderTotal(selectedPayment).toLocaleString("en-BD")}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Address">
                {selectedPayment.shippingAddress?.street},{" "}
                {selectedPayment.shippingAddress?.city}
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
                    background: "#f8fafc",
                    borderRadius: 8,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      Qty: {item.quantity} × Tk{" "}
                      {item.price?.toLocaleString("en-BD")}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    Tk{" "}
                    {((item.price || 0) * (item.quantity || 1)).toLocaleString(
                      "en-BD"
                    )}
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
