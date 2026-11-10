"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AntdProvider from "@/lib/antd/AntdProvider";
import { Spin } from "antd";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  ClipboardList,
  CreditCard,
  Star,
  Users,
  Settings,
  Home,
  Plus,
} from "lucide-react";
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
  isAdminRole,
  isJwtTokenValid,
  normalizeRoleString,
  parseJwtPayload,
} from "@/lib/authCookies";
import { useGetUserQuery } from "@/redux/service/profileData";
import { useGetAllOrdersQuery } from "@/redux/service/orderApi";
import { useGetAdminReviewsQuery } from "@/redux/service/reviewApi";
import { useLogoutMutation } from "@/redux/service/auth/authApi";
import { getOrderStatus } from "@/lib/orderUtils";
import {
  PortalSidebarShell,
  SidebarNavGroup,
  SidebarFooterLink,
} from "@/components/dashboard/PortalSidebarShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [adminAvatar, setAdminAvatar] = useState<string>("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [triggerLogout] = useLogoutMutation();

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
    const cookieRole = getClientCookie("role");
    const effectiveRole = payload?.role || cookieRole || user?.role;

    if (!isAdminRole(effectiveRole)) {
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
    skip: !isAuthorized,
  });

  // Reuse shared RTK Query caches for live pending badge counters
  const { data: ordersRes } = useGetAllOrdersQuery(undefined, {
    skip: !isAuthorized,
  });
  const { data: pendingReviewsRes } = useGetAdminReviewsQuery(
    { status: "pending", limit: 5 },
    { skip: !isAuthorized }
  );

  React.useEffect(() => {
    if (profileRes?.data && !isAdminRole(profileRes.data.role)) {
      router.replace("/dashboard");
      return;
    }

    if (profileRes?.data && !user) {
      const token = getClientCookie("accessToken") || getClientCookie("token");
      const normalizedRoleStr = normalizeRoleString(profileRes.data.role);
      if (typeof document !== "undefined") {
        document.cookie = `role=${normalizedRoleStr}; path=/; max-age=86400; SameSite=Lax`;
      }
      dispatch(
        setUser({
          user: {
            id: profileRes.data._id || profileRes.data.id || "",
            name: profileRes.data.name,
            email: profileRes.data.email,
            phone: profileRes.data.phone,
            role: UserRole[normalizedRoleStr],
            avatar: profileRes.data.avatar,
          },
          accessToken: token,
          refreshToken: null,
        })
      );
    }
  }, [profileRes, user, dispatch, router]);

  const effectiveAvatar =
    adminAvatar ||
    (typeof user?.avatar === "string"
      ? user.avatar
      : user?.avatar?.url || profileRes?.data?.avatar?.url) ||
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
    return () =>
      window.removeEventListener("grid_content_updated", handleUpdate);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await triggerLogout().unwrap();
    } catch {}
    clearAuthCookies();
    dispatch(logout());
    router.replace("/login");
  };

  if (checkingAuth || !isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Spin size="large" />
        <span className="text-sm text-slate-500 font-medium">
          Verifying administrator credentials...
        </span>
      </div>
    );
  }

  const allOrders = ordersRes?.data || [];
  const pendingOrdersCount = allOrders.filter(
    (o) => getOrderStatus(o) === "pending"
  ).length;
  const pendingReviewsCount =
    pendingReviewsRes?.meta?.total ?? pendingReviewsRes?.data?.length ?? 0;

  const displayName = user?.name || profileRes?.data?.name || "Store Admin";
  const displayEmail = user?.email || profileRes?.data?.email || "";
  const isSuperAdmin =
    normalizeRoleString(user?.role || profileRes?.data?.role) === "SUPER_ADMIN";

  const groups: SidebarNavGroup[] = [
    {
      label: "Core Operations",
      items: [
        {
          name: "Dashboard Overview",
          path: "/admin",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          name: "Orders",
          path: "/admin/orders",
          icon: ClipboardList,
          badge: pendingOrdersCount,
          badgeTone: "amber",
        },
        {
          name: "Payments",
          path: "/admin/payments",
          icon: CreditCard,
        },
      ],
    },
    {
      label: "Catalog & Moderation",
      items: [
        {
          name: "Products & Upload",
          path: "/admin/products",
          icon: ShoppingBag,
        },
        {
          name: "Categories",
          path: "/admin/categories",
          icon: FolderTree,
        },
        {
          name: "Reviews",
          path: "/admin/reviews",
          icon: Star,
          badge: pendingReviewsCount,
          badgeTone: "cyan",
        },
      ],
    },
    {
      label: "Directory & System",
      items: [
        {
          name: "Customers",
          path: "/admin/users",
          icon: Users,
        },
        {
          name: "Store Settings",
          path: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const footerLinks: SidebarFooterLink[] = [
    {
      name: "View Website",
      href: "/",
      icon: Home,
      external: true,
    },
  ];

  return (
    <AntdProvider>
      <PortalSidebarShell
        brandTitle="Unique Engineering"
        portalSubtitle="Admin Portal"
        navAriaLabel="Admin"
        groups={groups}
        footerLinks={footerLinks}
        user={{
          name: displayName,
          email: displayEmail,
          roleLabel: isSuperAdmin ? "Super Administrator" : "Store Administrator",
          avatarUrl: effectiveAvatar,
          verified: true,
        }}
        profileHref="/admin/settings"
        notificationHref="/admin/orders"
        notificationCount={pendingOrdersCount}
        headerAction={{
          label: "Add Product",
          href: "/admin/products",
          icon: <Plus className="h-3.5 w-3.5" aria-hidden="true" />,
        }}
        storageKey="uef_admin_sidebar_collapsed"
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      >
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-[0_1px_3px_rgba(15,23,42,0.03)] min-h-[calc(100svh-8.5rem)]">
          {children}
        </div>
      </PortalSidebarShell>
    </AntdProvider>
  );
}
