"use client";

import React, { useState } from "react";
import {
  Table,
  Tag,
  Typography,
  Card,
  Input,
  Avatar,
  Space,
  Alert,
  Button,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useGetAllUsersQuery } from "@/redux/service/adminApi";
import type { IUserProfile } from "@/redux/service/profileData";

const { Title, Text } = Typography;

export default function AdminUsersPage() {
  const [searchText, setSearchText] = useState("");
  const { data: usersRes, isLoading, isError, refetch } = useGetAllUsersQuery({
    limit: 100,
  });

  const usersList: IUserProfile[] = usersRes?.data || [];

  const filteredUsers = usersList.filter((u) => {
    const q = searchText.trim().toLowerCase();
    if (!q) return true;
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.phone || "").toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      title: "Customer",
      key: "name",
      render: (_: any, record: IUserProfile) => {
        const avatarUrl =
          typeof record.avatar === "string"
            ? record.avatar
            : record.avatar?.url || "";
        return (
          <Space>
            <Avatar
              src={avatarUrl || undefined}
              icon={!avatarUrl ? <UserOutlined /> : undefined}
              style={{ backgroundColor: "#0f172a" }}
            />
            <div>
              <div style={{ fontWeight: 600, color: "#0f172a" }}>
                {record.name || "Unnamed User"}
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                {record.email}
              </div>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) =>
        phone ? (
          <span style={{ fontWeight: 500 }}>{phone}</span>
        ) : (
          <Text type="secondary">Not provided</Text>
        ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const r = (role || "user").toUpperCase();
        return (
          <Tag color={r === "ADMIN" || r === "SUPER_ADMIN" ? "geekblue" : "default"}>
            {r}
          </Tag>
        );
      },
    },
    {
      title: "Verification",
      key: "verified",
      render: (_: any, record: IUserProfile) =>
        record.isEmailVerified ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Verified
          </Tag>
        ) : (
          <Tag color="gold" icon={<ClockCircleOutlined />}>
            Pending
          </Tag>
        ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {date
            ? new Date(date).toLocaleDateString("en-BD", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—"}
        </Text>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Customers &amp; Accounts
        </Title>
        <Text type="secondary">
          View registered customers, verification statuses, and contact numbers.
        </Text>
      </div>

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Unable to load registered accounts right now."
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      )}

      <Card styles={{ body: { padding: "14px 18px" } }}>
        <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
          <Input
            placeholder="Search by name, email, or phone..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Text type="secondary">
            Total Accounts: <strong>{filteredUsers.length}</strong>
          </Text>
        </Space>
      </Card>

      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey={(r) => r._id || r.id || r.email}
        loading={isLoading}
        scroll={{ x: 680 }}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: ["10", "20", "50"],
          showSizeChanger: true,
        }}
        locale={{ emptyText: "No registered accounts found." }}
      />
    </div>
  );
}

