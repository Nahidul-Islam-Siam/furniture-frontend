"use client";

import React from "react";
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Switch,
  Divider,
  Typography,
  Space,
  Row,
  Col,
  message,
} from "antd";
import {
  SettingOutlined,
  LockOutlined,
  BellOutlined,
  DatabaseOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export default function AdminSettingsPage() {
  const [generalForm] = Form.useForm();
  const [securityForm] = Form.useForm();

  const handleSave = () => {
    message.success("System configurations updated successfully");
  };

  const generalTab = (
    <Form
      form={generalForm}
      layout="vertical"
      initialValues={{
        appName: "React SaaS Cloud Platform",
        supportEmail: "support@saasplatform.com",
        maintenanceMode: false,
        analyticsTracking: true,
      }}
      onFinish={handleSave}
    >
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            name="appName"
            label="Platform Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter SaaS platform name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="supportEmail"
            label="Public Support Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder="support@domain.com" />
          </Form.Item>
        </Col>
      </Row>

      <Divider />

      <Title level={5}>Runtime Controls</Title>
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Text strong>Maintenance Mode</Text>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Redirect all incoming non-admin traffic to the service offline page.
              </Text>
            </div>
          </div>
          <Form.Item orientation="horizontal" name="maintenanceMode" valuePropName="checked" noStyle>
            <Switch />
          </Form.Item>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Text strong>Live Telemetry Collection</Text>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Stream application metrics and performance traces to analytics ingestors.
              </Text>
            </div>
          </div>
          <Form.Item orientation="horizontal" name="analyticsTracking" valuePropName="checked" noStyle>
            <Switch defaultChecked />
          </Form.Item>
        </div>
      </Space>

      <div style={{ marginTop: 32 }}>
        <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
          Save General Settings
        </Button>
      </div>
    </Form>
  );

  const securityTab = (
    <Form
      form={securityForm}
      layout="vertical"
      initialValues={{
        twoFactorEnforced: true,
        sessionTimeoutHours: 24,
      }}
      onFinish={handleSave}
    >
      <Title level={5}>Authentication & Session Policies</Title>
      <Paragraph type="secondary">
        Control credential enforcement, password rotation rules, and brute-force defenses.
      </Paragraph>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <Text strong>Enforce Two-Factor Authentication (2FA)</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Require TOTP or SMS verification for all administrator logins.
            </Text>
          </div>
        </div>
        <Form.Item name="twoFactorEnforced" valuePropName="checked" noStyle>
          <Switch defaultChecked />
        </Form.Item>
      </div>

      <Form.Item
        name="sessionTimeoutHours"
        label="Maximum Session Lifetime (Hours)"
        style={{ maxWidth: 300 }}
      >
        <Input type="number" suffix="hours" />
      </Form.Item>

      <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
        Update Security Policies
      </Button>
    </Form>
  );

  const tabItems = [
    {
      key: "general",
      label: (
        <span>
          <SettingOutlined /> General Configuration
        </span>
      ),
      children: generalTab,
    },
    {
      key: "security",
      label: (
        <span>
          <LockOutlined /> Security & Auth
        </span>
      ),
      children: securityTab,
    },
    {
      key: "database",
      label: (
        <span>
          <DatabaseOutlined /> Storage & Cache
        </span>
      ),
      children: (
        <div>
          <Paragraph type="secondary">
            Manage Redis connection parameters and persistent asset storage buckets.
          </Paragraph>
          <Button danger onClick={() => message.info("Redis cache flushed successfully")}>
            Purge Application Cache
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card bordered={false}>
      <Title level={3} style={{ marginTop: 0 }}>
        System Administration & Settings
      </Title>
      <Text type="secondary">
        Configure global system variables, runtime rules, security enforcement, and integration keys.
      </Text>

      <Tabs items={tabItems} style={{ marginTop: 20 }} />
    </Card>
  );
}

