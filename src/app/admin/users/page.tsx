"use client";

import React, { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Select,
  Typography,
  Card,
  Popconfirm,
  message,
} from "antd";
import {
  UserAddOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface UserRecord {
  key: string;
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "DEVELOPER";
  status: "Active" | "Suspended" | "Pending";
  joined: string;
}

export default function AdminUsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  const [users, setUsers] = useState<UserRecord[]>([
    {
      key: "usr_1",
      id: "usr_1",
      name: "Nahidul Islam",
      email: "nahidul@example.com",
      role: "ADMIN",
      status: "Active",
      joined: "Oct 12, 2026",
    },
    {
      key: "usr_2",
      id: "usr_2",
      name: "Sarah Connor",
      email: "sarah@cyberdyne.io",
      role: "USER",
      status: "Active",
      joined: "Oct 18, 2026",
    },
    {
      key: "usr_3",
      id: "usr_3",
      name: "Alex Mercer",
      email: "alex@gentek.org",
      role: "USER",
      status: "Suspended",
      joined: "Sep 29, 2026",
    },
    {
      key: "usr_4",
      id: "usr_4",
      name: "David Miller",
      email: "david@saasify.dev",
      role: "DEVELOPER",
      status: "Active",
      joined: "Aug 15, 2026",
    },
  ]);

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    message.success("User access revoked successfully");
  };

  const handleAddUser = (values: any) => {
    const newUser: UserRecord = {
      key: `usr_${Date.now()}`,
      id: `usr_${Date.now()}`,
      name: values.name,
      email: values.email,
      role: values.role,
      status: "Active",
      joined: "Just now",
    };
    setUsers([newUser, ...users]);
    message.success(`Invitation dispatched to ${values.email}`);
    setIsModalOpen(false);
    form.resetFields();
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "User Profile",
      key: "profile",
      render: (_: any, record: UserRecord) => (
        <div>
          <Text strong>{record.name}</Text>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const isAdm = role === "ADMIN";
        return (
          <Tag
            color={isAdm ? "red" : role === "DEVELOPER" ? "purple" : "blue"}
            icon={isAdm ? <SafetyCertificateOutlined /> : undefined}
          >
            {role}
          </Tag>
        );
      },
    },
    {
      title: "Account Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Active" ? "green" : status === "Suspended" ? "volcano" : "default"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Registration Date",
      dataIndex: "joined",
      key: "joined",
      render: (val: string) => <Text type="secondary">{val}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      align: "right" as const,
      render: (_: any, record: UserRecord) => (
        <Space size="small">
          <Button icon={<EditOutlined />} size="small" type="text" />
          <Popconfirm
            title="Revoke User Access"
            description="Are you sure you want to deactivate this account?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, revoke"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button icon={<DeleteOutlined />} size="small" danger type="text" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card bordered={false}>
      <Space orientation="vertical" size="middle" style={{ display: "flex" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              User Directory & Permissions
            </Title>
            <Text type="secondary">
              Manage team members, privilege assignments, and subscription privileges.
            </Text>
          </div>

          <Space>
            <Input
              placeholder="Search user by name or email..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 260 }}
              allowClear
            />
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Invite User
            </Button>
          </Space>
        </div>

        <Table
          dataSource={filteredUsers}
          columns={columns}
          pagination={{ pageSize: 5 }}
          style={{ marginTop: 16 }}
        />
      </Space>

      {/* Invite User Modal */}
      <Modal
        title="Invite Platform Member"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddUser}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please provide a name" }]}
          >
            <Input placeholder="Jane Doe" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please provide an email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="jane@example.com" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Access Role"
            initialValue="USER"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "USER", label: "User (Standard Access)" },
                { value: "DEVELOPER", label: "Developer (API & Webhooks)" },
                { value: "ADMIN", label: "Admin (Full System Privilege)" },
              ]}
            />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Send Invite
            </Button>
          </div>
        </Form>
      </Modal>
    </Card>
  );
}


