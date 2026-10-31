"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AntdProvider from "@/lib/antd/AntdProvider";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Badge,
  Space,
  Tag,
} from "antd";
import type { MenuProps } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  HomeOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector, logout } from "@/redux";

const { Header, Sider, Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link href="/admin">Dashboard & Analytics</Link>,
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: <Link href="/admin/users">User Management</Link>,
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: <Link href="/admin/products">Product Catalog</Link>,
    },
    {
      key: "/admin/reports",
      icon: <BarChartOutlined />,
      label: <Link href="/admin/reports">Telemetry & Reports</Link>,
    },
    {
      key: "/admin/roles",
      icon: <TeamOutlined />,
      label: <Link href="/admin/roles">Roles & Permissions</Link>,
    },
    {
      key: "/admin/settings",
      icon: <SettingOutlined />,
      label: <Link href="/admin/settings">System Settings</Link>,
    },
  ];

  const userDropdownItems: MenuProps["items"] = [
    {
      key: "website",
      icon: <HomeOutlined />,
      label: <Link href="/">View Website</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
      label: "Sign Out",
      onClick: handleLogout,
    },
  ];

  return (
    <AntdProvider>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Ant Design Sider */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={250}
          theme="light"
          style={{
            borderRight: "1px solid #f0f0f0",
            position: "sticky",
            top: 0,
            height: "100vh",
            left: 0,
            overflow: "auto",
          }}
        >
          {/* Logo Area */}
          <div
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              gap: 12,
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "#ef4444",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                flexShrink: 0,
              }}
            >
              <SafetyCertificateOutlined style={{ fontSize: 18 }} />
            </div>
            {!collapsed && (
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>
                  Admin Portal
                </div>
                <div style={{ fontSize: 10, color: "#8c8c8c", textTransform: "uppercase", fontWeight: 600 }}>
                  Ant Design Suite
                </div>
              </div>
            )}
          </div>

          {/* Sider Menu */}
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            style={{ borderRight: 0, padding: "8px 0" }}
          />

          {/* Bottom links */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              padding: 12,
              borderTop: "1px solid #f0f0f0",
              background: "#ffffff",
            }}
          >
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button
                type="text"
                icon={<HomeOutlined />}
                block
                style={{ textAlign: "left", marginBottom: 6 }}
              >
                {!collapsed && "View Website"}
              </Button>
            </Link>
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              block
              style={{ textAlign: "left" }}
            >
              {!collapsed && "Sign Out"}
            </Button>
          </div>
        </Sider>

        {/* Main Layout */}
        <Layout>
          {/* Ant Design Header */}
          <Header
            style={{
              padding: "0 24px",
              background: "#ffffff",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <Space orientation="horizontal" size="middle">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: 16 }}
              />
              <Tag color="red" style={{ fontWeight: 600 }}>
                Admin Shield Active
              </Tag>
            </Space>

            <Space orientation="horizontal" size="large">
              <Badge count={3} size="small">
                <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: 18 }} />} />
              </Badge>

              <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight">
                <Space style={{ cursor: "pointer" }}>
                  <Avatar style={{ backgroundColor: "#2563eb" }}>
                    {user?.name?.[0] || "A"}
                  </Avatar>
                  <div style={{ lineHeight: 1.2 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>
                      {user?.name || "Administrator"}
                    </div>
                    <div style={{ fontSize: 11, color: "#8c8c8c" }}>
                      {user?.email || "admin@system.com"}
                    </div>
                  </div>
                </Space>
              </Dropdown>
            </Space>
          </Header>

          {/* Ant Design Content */}
          <Content
            style={{
              margin: "24px",
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </AntdProvider>
  );
}

