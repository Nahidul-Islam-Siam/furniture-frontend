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
import {
  useAppDispatch,
  useAppSelector,
  logout,
  setAccessToken,
  setUser,
  UserRole,
} from "@/redux";
import {
  clearAuthCookies,
  getClientCookie,
  isJwtTokenValid,
  parseJwtPayload,
} from "@/lib/authCookies";
import { useGetUserQuery } from "@/redux/service/profileData";

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
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [adminAvatar, setAdminAvatar] = useState<string>("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Guard: Protect Admin routes from unauthorized or stale sessions
  React.useEffect(() => {
    const token = getClientCookie("accessToken") || getClientCookie("token");

    if (!token || !isJwtTokenValid(token)) {
      clearAuthCookies();
      dispatch(logout());
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    const payload = parseJwtPayload(token);
    const cookieRole = (getClientCookie("role") || "").toUpperCase();
    const tokenRole = (payload?.role || "").toUpperCase();
    const userRole = (user?.role as string)?.toUpperCase() || "";
    const effectiveRole = tokenRole || cookieRole || userRole;
    const isAdmin =
      effectiveRole === "ADMIN" || effectiveRole === "SUPER_ADMIN";

    if (!isAdmin) {
      router.replace("/dashboard");
      return;
    }

    if (!accessToken) {
      dispatch(setAccessToken(token));
    }

    setIsAuthorized(true);
    setCheckingAuth(false);
  }, [user, accessToken, pathname, router, dispatch]);

  const { data: profileRes } = useGetUserQuery(undefined, {
    skip: !isAuthorized || !!user,
  });

  React.useEffect(() => {
    if (profileRes?.data && !user) {
      const token = getClientCookie("accessToken") || getClientCookie("token");
      const rawRole = (profileRes.data.role || "ADMIN").toUpperCase();
      dispatch(
        setUser({
          user: {
            id: profileRes.data._id || profileRes.data.id || "",
            name: profileRes.data.name,
            email: profileRes.data.email,
            phone: profileRes.data.phone,
            role:
              rawRole === "ADMIN" || rawRole === "SUPER_ADMIN"
                ? UserRole.ADMIN
                : UserRole.USER,
            avatar: profileRes.data.avatar,
          },
          accessToken: token,
          refreshToken: null,
        })
      );
    }
  }, [profileRes, user, dispatch]);

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
    clearAuthCookies();
    dispatch(logout());
    router.replace("/login");
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
          <Link
            href="/"
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              padding: collapsed ? "0" : "0 20px",
              borderBottom: "1px solid #f0f0f0",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <img
              src="/images/uef-emblem.png"
              alt="UEF Logo"
              style={{
                width: 34,
                height: 34,
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
            {!collapsed && (
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#09090b", textTransform: "uppercase" }}>
                  Unique Engineering
                </div>
                <div style={{ fontSize: 11, color: "#0284c7", fontWeight: 700 }}>
                  Admin Portal
                </div>
              </div>
            )}
          </Link>

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

              <Link href="/admin/orders" title="View Customer Orders">
                <Button
                  type="text"
                  shape="circle"
                  icon={<BellOutlined />}
                  style={{ fontSize: 16 }}
                />
              </Link>

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
