"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  User as UserIcon,
  CreditCard,
  Settings,
  LogOut,
  Loader2,
  Menu,
  ExternalLink,
  Bell,
  Home,
  ShieldCheck,
  X,
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
  isJwtTokenValid,
  parseJwtPayload,
} from "@/lib/authCookies";
import { useGetUserQuery } from "@/redux/service/profileData";
import { useLogoutMutation } from "@/redux/service/auth/authApi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
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

    if (!accessToken) {
      dispatch(setAccessToken(token));
    }

    setIsAuthorized(true);
    setCheckingAuth(false);
  }, [accessToken, pathname, router, dispatch]);

  // Rehydrate Redux user on hard refresh so header/profile name, email, and avatar appear immediately
  const { data: profileRes } = useGetUserQuery(undefined, {
    skip: !isAuthorized || !!user,
  });

  React.useEffect(() => {
    if (profileRes?.data && !user) {
      const token = getClientCookie("accessToken") || getClientCookie("token");
      const rawRole = (profileRes.data.role || "USER").toUpperCase();
      const normalizedRole =
        rawRole === "ADMIN" || rawRole === "SUPER_ADMIN"
          ? UserRole.ADMIN
          : UserRole.USER;
      dispatch(
        setUser({
          user: {
            id: profileRes.data._id || profileRes.data.id || "",
            name: profileRes.data.name,
            email: profileRes.data.email,
            phone: profileRes.data.phone,
            role: normalizedRole,
            avatar: profileRes.data.avatar,
          },
          accessToken: token,
          refreshToken: null,
        })
      );
    }
  }, [profileRes, user, dispatch]);

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

  const navItems = [
    {
      name: "Dashboard Overview",
      path: "/dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    { name: "My Orders", path: "/dashboard/orders", icon: ShoppingBag },
    { name: "Billing & Invoices", path: "/dashboard/billing", icon: CreditCard },
    { name: "My Profile", path: "/dashboard/profile", icon: UserIcon },
    { name: "Account Settings", path: "/dashboard/settings", icon: Settings },
  ];

  const tokenPayload = parseJwtPayload(
    getClientCookie("accessToken") || getClientCookie("token")
  );
  const currentRole = (
    user?.role ||
    tokenPayload?.role ||
    getClientCookie("role") ||
    ""
  ).toUpperCase();
  const isAdmin = currentRole === "ADMIN" || currentRole === "SUPER_ADMIN";

  const avatarUrl =
    typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url || "";
  const displayName = user?.name || tokenPayload?.email?.split("@")[0] || "Account";
  const displayEmail = user?.email || tokenPayload?.email || "";

  if (checkingAuth || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">
            Verifying account access...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground font-sans">
      {/* Mobile Sidebar Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300 md:static ${
          sidebarOpen ? "w-64" : "w-20"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand header with UEF Emblem Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold tracking-tight no-underline hover:no-underline"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-200/80 p-1 shadow-xs">
              <Image
                src="/images/uef-emblem.png"
                alt="Unique Engineering & Furniture"
                width={32}
                height={32}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-black tracking-wide uppercase text-slate-900">
                  Unique Engineering
                </span>
                <span className="text-[10px] text-cyan-600 uppercase tracking-widest font-bold">
                  Customer Portal
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden rounded p-1.5 text-muted-foreground hover:bg-accent md:inline-flex bg-transparent border-0 cursor-pointer"
            title="Toggle Sidebar"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded p-1.5 text-muted-foreground hover:bg-accent md:hidden bg-transparent border-0 cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.end
              ? pathname === item.path
              : pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors no-underline ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                } ${!sidebarOpen ? "justify-center" : ""}`}
                title={!sidebarOpen ? item.name : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer links */}
        <div className="border-t p-3 space-y-1">
          {isAdmin && (
            <Link
              href="/admin"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-50 no-underline transition-colors ${
                !sidebarOpen ? "justify-center" : ""
              }`}
              title="Switch to Admin Portal"
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>Admin Portal</span>}
            </Link>
          )}

          <Link
            href="/"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground no-underline transition-colors ${
              !sidebarOpen ? "justify-center" : ""
            }`}
            title="Return to Website"
          >
            <Home className="h-4 w-4 shrink-0" />
            {sidebarOpen && (
              <span className="flex items-center gap-1">
                Return to Store <ExternalLink className="h-3 w-3 opacity-60" />
              </span>
            )}
          </Link>

          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors bg-transparent border-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
              !sidebarOpen ? "justify-center" : ""
            }`}
            title="Sign Out"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4 shrink-0" />
            )}
            {sidebarOpen && (
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b bg-card/60 px-4 sm:px-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded p-1.5 text-muted-foreground hover:bg-accent md:hidden bg-transparent border-0 cursor-pointer"
              aria-label="Open Navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-muted-foreground">
              Welcome,{" "}
              <span className="text-foreground font-semibold">{displayName}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/dashboard/orders"
              className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              title="View Recent Orders"
              aria-label="View Recent Orders"
            >
              <Bell className="h-4 w-4" />
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2.5 border-l pl-3 sm:pl-4 no-underline hover:opacity-85 transition-opacity"
            >
              <div className="flex h-8 w-8 overflow-hidden items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs uppercase border border-slate-200">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  displayName[0] || "U"
                )}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold leading-none text-foreground">
                  {displayName}
                </p>
                {displayEmail && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {displayEmail}
                  </p>
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
