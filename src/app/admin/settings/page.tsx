"use client";

import React from "react";
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Avatar,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "@/redux";

const { Title, Text, Paragraph } = Typography;

export default function AdminSettingsPage() {
  const { user } = useAppSelector((state) => state.auth);

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [aboutForm] = Form.useForm();
  const [privacyForm] = Form.useForm();
  const [termsForm] = Form.useForm();

  const handleProfileSave = (values: any) => {
    message.success("Admin profile updated successfully!");
  };

  const handlePasswordSave = (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("New password and confirm password do not match!");
      return;
    }
    passwordForm.resetFields();
    message.success("Password changed successfully!");
  };

  const handleContentSave = (section: string) => {
    message.success(`${section} updated successfully!`);
  };

  // 1. Profile Tab
  const profileTab = (
    <Card bordered={false}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
        <Avatar size={72} style={{ backgroundColor: "#09090b", fontSize: 28 }}>
          {user?.name ? user.name[0].toUpperCase() : "A"}
        </Avatar>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {user?.name || "Store Administrator"}
          </Title>
          <Text type="secondary">{user?.email || "admin@gridfurniture.com"}</Text>
          <div style={{ marginTop: 4 }}>
            <span
              style={{
                fontSize: 12,
                background: "#f5f5f5",
                padding: "2px 8px",
                borderRadius: 4,
                color: "#595959",
                fontWeight: 600,
              }}
            >
              Super Administrator
            </span>
          </div>
        </div>
      </div>

      <Form
        form={profileForm}
        layout="vertical"
        initialValues={{
          fullName: user?.name || "Admin Siam",
          email: user?.email || "admin@gridfurniture.com",
          phone: "+880 1712-345678",
        }}
        onFinish={handleProfileSave}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Enter your full name" size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[{ required: true, type: "email", message: "Please enter valid email" }]}
        >
          <Input placeholder="Enter admin email address" size="large" />
        </Form.Item>

        <Form.Item name="phone" label="Phone Number">
          <Input placeholder="+880 1..." size="large" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          size="large"
          style={{ background: "#09090b" }}
        >
          Save Profile
        </Button>
      </Form>
    </Card>
  );

  // 2. Change Password Tab
  const passwordTab = (
    <Card bordered={false} style={{ maxWidth: 600 }}>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Ensure your account uses a strong, random password to maintain administrative security.
      </Paragraph>

      <Form
        form={passwordForm}
        layout="vertical"
        onFinish={handlePasswordSave}
      >
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[{ required: true, message: "Please enter current password" }]}
        >
          <Input.Password placeholder="Enter current password" size="large" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[{ required: true, min: 6, message: "Minimum 6 characters required" }]}
        >
          <Input.Password placeholder="Enter new password" size="large" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          rules={[{ required: true, message: "Please confirm your new password" }]}
        >
          <Input.Password placeholder="Re-enter new password" size="large" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          size="large"
          style={{ background: "#09090b" }}
        >
          Update Password
        </Button>
      </Form>
    </Card>
  );

  // 3. About Us Tab
  const aboutTab = (
    <Card bordered={false}>
      <Paragraph type="secondary" style={{ marginBottom: 20 }}>
        Edit the About Us story and brand background shown to website visitors.
      </Paragraph>

      <Form
        form={aboutForm}
        layout="vertical"
        initialValues={{
          aboutText:
            "GRID is a modern work lifestyle brand committed to reimagining ergonomics, craftsmanship, and aesthetic balance for forward-thinking workspaces. In partnership with global ergonomic pioneers like Steelcase, we craft high-performance desks, seating systems, and modular furniture engineered for peak focus and wellness.",
        }}
        onFinish={() => handleContentSave("About Us")}
      >
        <Form.Item
          name="aboutText"
          label="About Us Content"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={8} placeholder="Write store story..." />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          size="large"
          style={{ background: "#09090b" }}
        >
          Save About Us
        </Button>
      </Form>
    </Card>
  );

  // 4. Privacy Policy Tab
  const privacyTab = (
    <Card bordered={false}>
      <Paragraph type="secondary" style={{ marginBottom: 20 }}>
        Manage customer data privacy, information protection, and store checkout policies.
      </Paragraph>

      <Form
        form={privacyForm}
        layout="vertical"
        initialValues={{
          privacyText:
            "At GRID Furniture, your privacy is our highest priority. We collect customer information exclusively to fulfill furniture orders, process secure payments, and coordinate doorstep delivery across Bangladesh. We never share, sell, or disclose personal customer data to unauthorized third parties.",
        }}
        onFinish={() => handleContentSave("Privacy Policy")}
      >
        <Form.Item
          name="privacyText"
          label="Privacy Policy Statement"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={8} placeholder="Write privacy terms..." />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          size="large"
          style={{ background: "#09090b" }}
        >
          Save Privacy Policy
        </Button>
      </Form>
    </Card>
  );

  // 5. Terms & Conditions Tab
  const termsTab = (
    <Card bordered={false}>
      <Paragraph type="secondary" style={{ marginBottom: 20 }}>
        Specify terms of service, product warranties, return windows, and delivery terms.
      </Paragraph>

      <Form
        form={termsForm}
        layout="vertical"
        initialValues={{
          termsText:
            "All GRID ergonomic chairs and motorized standing desks carry authentic manufacturer warranties (up to 5 years on selected models). Deliveries inside Dhaka are completed within 48 hours; nationwide delivery takes 3-5 business days. Returns or replacements for transit defects are honored within 7 days of delivery inspection.",
        }}
        onFinish={() => handleContentSave("Terms & Conditions")}
      >
        <Form.Item
          name="termsText"
          label="Terms & Conditions Agreement"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={8} placeholder="Write terms and conditions..." />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          size="large"
          style={{ background: "#09090b" }}
        >
          Save Terms & Conditions
        </Button>
      </Form>
    </Card>
  );

  const tabItems = [
    {
      key: "profile",
      label: (
        <span>
          <UserOutlined />
          Admin Profile
        </span>
      ),
      children: profileTab,
    },
    {
      key: "password",
      label: (
        <span>
          <LockOutlined />
          Change Password
        </span>
      ),
      children: passwordTab,
    },
    {
      key: "about",
      label: (
        <span>
          <InfoCircleOutlined />
          About Us
        </span>
      ),
      children: aboutTab,
    },
    {
      key: "privacy",
      label: (
        <span>
          <FileTextOutlined />
          Privacy Policy
        </span>
      ),
      children: privacyTab,
    },
    {
      key: "terms",
      label: (
        <span>
          <FileTextOutlined />
          Terms & Conditions
        </span>
      ),
      children: termsTab,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0 }}>
          Admin & Content Settings
        </Title>
        <Text type="secondary">
          Manage your personal administrator credentials and update store public legal content.
        </Text>
      </div>

      <Tabs defaultActiveKey="profile" items={tabItems} size="large" />
    </div>
  );
}
