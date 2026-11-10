"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  User as UserIcon,
  CreditCard,
  Settings,
  Home,
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
import { useGetMyOrdersQuery } from "@/redux/service/orderApi";
import { useLogoutMutation } from "@/redux/service/auth/authApi";
import { getOrderStatus } from "@/lib/orderUtils";
import {
  PortalSidebarShell,
  SidebarNavGroup,
  SidebarFooterLink,
} from "@/components/dashboard/PortalSidebarShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [triggerLogout] = useLogoutMutation();

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

    if (isAdminRole(effectiveRole)) {
      router.replace("/admin");
      return;
    }

    if (!accessToken) {
      dispatch(setAccessToken(token));
    }

    setIsAuthorized(true);
    setCheckingAuth(false);
  }, [user?.role, accessToken, pathname, router, dispatch]);

  // Rehydrate Redux user on hard refresh so header/profile name, email, and avatar appear immediately
  const { data: profileRes } = useGetUserQuery(undefined, {
    skip: !isAuthorized,
  });

  const { data: ordersRes } = useGetMyOrdersQuery(undefined, {
    skip: !isAuthorized,
  });

  React.useEffect(() => {
    if (profileRes?.data && isAdminRole(profileRes.data.role)) {
      router.replace("/admin");
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
          <p className="text-sm text-slate-600 font-medium">
            Verifying account access...
          </p>
        </div>
      </div>
    );
  }

  const ordersList = ordersRes?.data || [];
  const activeOrdersCount = ordersList.filter((o) => {
    const s = getOrderStatus(o);
    return s !== "delivered" && s !== "cancelled";
  }).length;

  const tokenPayload = parseJwtPayload(
    getClientCookie("accessToken") || getClientCookie("token")
  );

  const avatarUrl =
    typeof user?.avatar === "string"
      ? user.avatar
      : user?.avatar?.url || profileRes?.data?.avatar?.url || "";
  const displayName =
    user?.name ||
    profileRes?.data?.name ||
    tokenPayload?.email?.split("@")[0] ||
    "Account";
  const displayEmail =
    user?.email || profileRes?.data?.email || tokenPayload?.email || "";

  const groups: SidebarNavGroup[] = [
    {
      label: "Overview & Orders",
      items: [
        {
          name: "Dashboard Overview",
          path: "/dashboard",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          name: "My Orders",
          path: "/dashboard/orders",
          icon: ShoppingBag,
          badge: activeOrdersCount,
          badgeTone: "cyan",
        },
        {
          name: "Billing & Invoices",
          path: "/dashboard/billing",
          icon: CreditCard,
        },
      ],
    },
    {
      label: "Account & Security",
      items: [
        {
          name: "Profile & Address",
          path: "/dashboard/profile",
          icon: UserIcon,
        },
        {
          name: "Account Settings",
          path: "/dashboard/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const footerLinks: SidebarFooterLink[] = [
    {
      name: "Return to Storefront",
      href: "/",
      icon: Home,
      external: true,
    },
  ];

  return (
    <PortalSidebarShell
      brandTitle="Unique Engineering"
      portalSubtitle="Customer Portal"
      navAriaLabel="Customer"
      groups={groups}
      footerLinks={footerLinks}
      user={{
        name: displayName,
        email: displayEmail,
        roleLabel: displayEmail || "Customer Account",
        avatarUrl,
        verified: Boolean(profileRes?.data?.isEmailVerified),
      }}
      profileHref="/dashboard/profile"
      notificationHref="/dashboard/orders"
      notificationCount={activeOrdersCount}
      headerAction={{
        label: "Browse Catalog",
        href: "/collections",
        icon: <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />,
      }}
      storageKey="uef_customer_sidebar_collapsed"
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
    >
      {children}
    </PortalSidebarShell>
  );
}
