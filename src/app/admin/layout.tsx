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
  ShoppingOutlined,
  OrderedListOutlined,
  CreditCardOutlined,
  SettingOutlined,
  LogoutOutlined,
  HomeOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
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
      label: <Link href="/admin">Dashboard Overview</Link>,
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: <Link href="/admin/products">Products & Upload</Link>,
    },
    {
      key: "/admin/orders",
      icon: <OrderedListOutlined />,
      label: <Link href="/admin/orders">Orders</Link>,
    },
    {
      key: "/admin/payments",
      icon: <CreditCardOutlined />,
      label: <Link href="/admin/payments">Payments</Link>,
    },
    {
      key: "/admin/settings",
      icon: <SettingOutlined />,
      label: <Link href="/admin/settings">Settings</Link>,
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
          width={240}
          style={{
            background: "#ffffff",
            borderRight: "1px solid #f0f0f0",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "auto",
          }}
        >
          {/* Admin Brand Logo Header */}
          <div
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              padding: collapsed ? "0" : "0 20px",
              borderBottom: "1px solid #f0f0f0",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "#09090b",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: 14,
                letterSpacing: "0.05em",
                flexShrink: 0,
              }}
            >
              G
            </div>
            {!collapsed && (
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#09090b" }}>
                  GRID Furniture
                </div>
                <div style={{ fontSize: 11, color: "#8c8c8c" }}>
                  Admin Portal
                </div>
              </div>
            )}
          </div>

          {/* Sider Menu */}
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            style={{
              borderRight: 0,
              padding: "12px 8px",
            }}
          />
        </Sider>

        {/* Main Content Area */}
        <Layout>
          {/* Header */}
          <Header
            style={{
              padding: "0 24px",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #f0f0f0",
              height: 64,
            }}
          >
            {/* Collapse toggle button */}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: 16,
                width: 48,
                height: 48,
              }}
            />

            {/* Header Right Actions */}
            <Space size="middle">
              <Tag color="black" style={{ borderRadius: 12, padding: "2px 10px", margin: 0 }}>
                Store Admin
              </Tag>

              <Badge count={3} size="small">
                <Button
                  type="text"
                  shape="circle"
                  icon={<BellOutlined />}
                  style={{ fontSize: 16 }}
                />
              </Badge>

              <Dropdown
                menu={{ items: userDropdownItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Space style={{ cursor: "pointer", padding: "4px 8px", borderRadius: 6 }}>
                  <Avatar
                    style={{ backgroundColor: "#09090b", verticalAlign: "middle" }}
                    size="small"
                  >
                    {user?.name ? user.name[0].toUpperCase() : "A"}
                  </Avatar>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#262626" }}>
                    {user?.name || "Store Admin"}
                  </span>
                </Space>
              </Dropdown>
            </Space>
          </Header>

          {/* Page Body */}
          <Content
            style={{
              margin: "24px",
              padding: "24px",
              background: "#ffffff",
              borderRadius: 8,
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
