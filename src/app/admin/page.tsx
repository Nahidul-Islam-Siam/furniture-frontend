"use client";

import React from "react";
import { Card, Col, Row, Statistic, Table, Tag, Progress, Typography, Space, Button } from "antd";
import {
  ArrowUpOutlined,
  DollarOutlined,
  UsergroupAddOutlined,
  ShoppingOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface EventItem {
  key: string;
  event: string;
  status: "success" | "warning" | "processing";
  timestamp: string;
}

export default function AdminDashboardPage() {
  const eventsData: EventItem[] = [
    {
      key: "1",
      event: "Automated database backup snapshot #492 completed",
      status: "success",
      timestamp: "12m ago",
    },
    {
      key: "2",
      event: "High API throughput spike on /api/v1/auth (1,240 req/sec)",
      status: "warning",
      timestamp: "45m ago",
    },
    {
      key: "3",
      event: "New enterprise subscription tier activated (Annual Plan)",
      status: "success",
      timestamp: "2h ago",
    },
    {
      key: "4",
      event: "Security vulnerability scanner run (0 critical issues)",
      status: "processing",
      timestamp: "4h ago",
    },
  ];

  const columns = [
    {
      title: "System Event",
      dataIndex: "event",
      key: "event",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === "success" ? "green" : status === "warning" ? "gold" : "blue";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (time: string) => <Text type="secondary">{time}</Text>,
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ display: "flex" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Analytics & System Telemetry
          </Title>
          <Text type="secondary">
            Real-time platform metrics, resource consumption, and administrative events.
          </Text>
        </div>
        <Button icon={<ReloadOutlined />}>Refresh Metrics</Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Total Revenue"
              value={45231.89}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="USD"
              valueStyle={{ color: "#3f8600", fontWeight: 700 }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="green">
                <ArrowUpOutlined /> +20.1%
              </Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                vs last month
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Active Users"
              value={2350}
              prefix={<UsergroupAddOutlined />}
              valueStyle={{ color: "#1677ff", fontWeight: 700 }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="blue">
                <ArrowUpOutlined /> +180.1%
              </Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                verified members
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Sales Transactions"
              value={12234}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#722ed1", fontWeight: 700 }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="purple">
                <ArrowUpOutlined /> +19%
              </Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                order conversions
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Active Subscriptions"
              value={573}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: "#fa8c16", fontWeight: 700 }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="orange">+201 new</Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                recurring tiers
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* System Telemetry & Logs */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Live System Event Stream" bordered={false}>
            <Table
              dataSource={eventsData}
              columns={columns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Cluster Resource Load" bordered={false}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>CPU Utilization</Text>
                <Text strong>38%</Text>
              </div>
              <Progress percent={38} status="active" strokeColor="#1677ff" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Memory Allocation (RAM)</Text>
                <Text strong>64%</Text>
              </div>
              <Progress percent={64} status="normal" strokeColor="#52c41a" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Database Disk IOPS</Text>
                <Text strong>82%</Text>
              </div>
              <Progress percent={82} status="exception" strokeColor="#faad14" />
            </div>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

