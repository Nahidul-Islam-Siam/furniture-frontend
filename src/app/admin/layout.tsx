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
  Spin,
} from "antd";
import type { MenuProps } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  CreditCardOutlined,
  SettingOutlined,
  StarOutlined,
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
  const [adminAvatar, setAdminAvatar] = useState<string>("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Guard: Protect Admin routes from unauthorized visitors
  React.useEffect(() => {
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return null;
      const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
      );
      return match ? match[2] : null;
    };

    const token = getCookie("accessToken") || getCookie("token");
    const cookieRole = (getCookie("role") || "").toUpperCase();

    const userRole = (user?.role as string)?.toUpperCase() || "";
    const isAdmin =
      cookieRole === "ADMIN" ||
      cookieRole === "SUPER_ADMIN" ||
      userRole === "ADMIN" ||
      userRole === "SUPER_ADMIN";

    if (!token && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!isAdmin) {
      router.replace("/dashboard");
      return;
    }

    setIsAuthorized(true);
    setCheckingAuth(false);
  }, [user, pathname, router]);

  const effectiveAvatar =
    adminAvatar ||
    (typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url) ||
    "";

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("grid_store_adminProfile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.avatar) setAdminAvatar(parsed.avatar);
      }
    } catch {}

    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem("grid_store_adminProfile");
        if (saved) {
          const parsed = JSON.parse(saved);
          setAdminAvatar(parsed.avatar || "");
        }
      } catch {}
    };
    window.addEventListener("grid_content_updated", handleUpdate);
    return () => window.removeEventListener("grid_content_updated", handleUpdate);
  }, []);

  const handleLogout = () => {
    if (typeof document !== "undefined") {
      document.cookie = "accessToken=; path=/; max-age=0";
      document.cookie = "token=; path=/; max-age=0";
      document.cookie = "role=; path=/; max-age=0";
    }
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
      key: "/admin/categories",
      icon: <AppstoreOutlined />,
      label: <Link href="/admin/categories">Categories</Link>,
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
      key: "/admin/reviews",
      icon: <StarOutlined />,
      label: <Link href="/admin/reviews">Reviews</Link>,
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

  if (checkingAuth || !isAuthorized) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa",
          gap: 16,
        }}
      >
        <Spin size="large" />
        <span style={{ fontSize: 14, color: "#666", fontWeight: 500 }}>
          Verifying administrator credentials...
        </span>
      </div>
    );
  }

  return (
    <AntdProvider>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Ant Design Sider with Responsive Mobile Breakpoint */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth={0}
          onBreakpoint={(broken) => {
            if (broken) {
              setCollapsed(true);
            }
          }}
          width={240}
          style={{
            background: "#ffffff",
            borderRight: "1px solid #f0f0f0",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "auto",
            zIndex: 100,
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
        <Layout style={{ minWidth: 0, background: "#f8f9fa" }}>
          {/* Header */}
          <Header
            style={{
              padding: "0 clamp(12px, 2vw, 24px)",
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
                fontSize: 18,
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                    src={effectiveAvatar || undefined}
                    style={{ backgroundColor: "#09090b", verticalAlign: "middle" }}
                    size="small"
                  >
                    {!effectiveAvatar && (user?.name ? user.name[0].toUpperCase() : "A")}
                  </Avatar>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#262626",
                    }}
                    className="hidden sm:inline"
                  >
                    {user?.name || "Store Admin"}
                  </span>
                </Space>
              </Dropdown>
            </Space>
          </Header>

          {/* Page Body - Responsive Padding & Margin */}
          <Content
            style={{
              margin: "clamp(12px, 2vw, 24px)",
              padding: "clamp(14px, 2.5vw, 24px)",
              background: "#ffffff",
              borderRadius: 8,
              minHeight: 280,
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </AntdProvider>
  );
}
