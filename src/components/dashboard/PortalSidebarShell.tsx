"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  Loader2,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

export interface SidebarNavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  exact?: boolean;
  badge?: number | string;
  badgeTone?: "default" | "amber" | "cyan" | "red";
}

export interface SidebarNavGroup {
  label: string;
  items: SidebarNavItem[];
}

export interface SidebarFooterLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  external?: boolean;
  highlight?: boolean;
}

export interface PortalUserSummary {
  name: string;
  email?: string;
  roleLabel?: string;
  avatarUrl?: string;
  verified?: boolean;
}

interface PortalSidebarShellProps {
  brandTitle: string;
  portalSubtitle: string;
  navAriaLabel: string;
  groups: SidebarNavGroup[];
  footerLinks?: SidebarFooterLink[];
  user: PortalUserSummary;
  profileHref: string;
  notificationHref: string;
  notificationCount?: number;
  headerAction?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  storageKey?: string;
  onLogout: () => void;
  isLoggingOut: boolean;
  children: React.ReactNode;
}

const BADGE_CLASSES: Record<NonNullable<SidebarNavItem["badgeTone"]>, string> = {
  default: "bg-slate-100 text-slate-700",
  amber: "bg-amber-100 text-amber-800",
  cyan: "bg-cyan-100 text-cyan-800",
  red: "bg-red-100 text-red-700",
};

export const PortalSidebarShell: React.FC<PortalSidebarShellProps> = ({
  brandTitle,
  portalSubtitle,
  navAriaLabel,
  groups,
  footerLinks = [],
  user,
  profileHref,
  notificationHref,
  notificationCount = 0,
  headerAction,
  storageKey = "uef_sidebar_collapsed",
  onLogout,
  isLoggingOut,
  children,
}) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileDrawerRef = useRef<HTMLElement>(null);

  // Restore saved desktop sidebar collapse preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "true") setCollapsed(true);
    } catch {}
  }, [storageKey]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(storageKey, String(next));
      } catch {}
      return next;
    });
  };

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Accessible mobile drawer: Escape-to-dismiss + initial focus
  useEffect(() => {
    if (!mobileOpen) return;

    mobileDrawerRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        mobileTriggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Resolve current active item label for the top bar breadcrumb
  const allItems = groups.flatMap((g) => g.items);
  const activeItem = allItems.find((item) =>
    item.exact ? pathname === item.path : pathname.startsWith(item.path)
  );
  const currentPageTitle = activeItem?.name || portalSubtitle;
  const userInitial = (user.name?.[0] || "U").toUpperCase();

  const renderSidebarBody = (isMobileDrawer: boolean) => {
    const showLabels = isMobileDrawer || !collapsed;

    return (
      <div className="flex h-full flex-col bg-white text-slate-900 select-none">
        {/* Brand Header */}
        <div
          className={`flex h-16 shrink-0 items-center border-b border-slate-100 ${
            showLabels ? "justify-between px-4" : "justify-center px-2"
          }`}
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 min-w-0 no-underline hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 rounded-lg"
            title={showLabels ? undefined : `${brandTitle} — ${portalSubtitle}`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/80 p-1 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <Image
                src="/images/uef-emblem.png"
                alt={brandTitle}
                width={32}
                height={32}
                className="h-full w-full object-contain"
                priority
              />
            </div>

            {showLabels && (
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-[12px] font-black tracking-wide uppercase text-slate-900 truncate">
                  {brandTitle}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-600 truncate">
                  {portalSubtitle}
                </span>
              </div>
            )}
          </Link>

          {isMobileDrawer && (
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                mobileTriggerRef.current?.focus();
              }}
              aria-label="Close navigation drawer"
              className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 bg-transparent border-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-colors"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Grouped Navigation Links */}
        <nav
          aria-label={navAriaLabel}
          className="flex-1 overflow-y-auto px-3 py-4 space-y-5"
        >
          {groups.map((group, groupIdx) => (
            <div key={group.label}>
              {showLabels ? (
                <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  {group.label}
                </div>
              ) : (
                groupIdx > 0 && (
                  <div
                    aria-hidden="true"
                    className="mx-3 mb-3 h-px bg-slate-100"
                  />
                )
              )}

              <ul role="list" className="m-0 p-0 list-none space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? pathname === item.path
                    : pathname.startsWith(item.path);
                  const hasBadge =
                    typeof item.badge === "number"
                      ? item.badge > 0
                      : Boolean(item.badge);
                  const badgeCls =
                    BADGE_CLASSES[item.badgeTone || "default"];

                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        aria-current={isActive ? "page" : undefined}
                        title={!showLabels ? item.name : undefined}
                        onClick={() => {
                          if (isMobileDrawer) setMobileOpen(false);
                        }}
                        className={`group relative flex min-h-[40px] items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-150 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                          isActive
                            ? "bg-slate-900 text-white shadow-[0_2px_8px_-2px_rgba(15,23,42,0.28)]"
                            : "text-slate-600 hover:bg-slate-100/85 hover:text-slate-900"
                        } ${!showLabels ? "justify-center px-0" : ""}`}
                      >
                        {/* Active left accent pill */}
                        {isActive && showLabels && (
                          <span
                            aria-hidden="true"
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-cyan-400"
                          />
                        )}

                        <span className="relative inline-flex shrink-0 items-center justify-center">
                          <Icon
                            aria-hidden="true"
                            className={`h-[17px] w-[17px] transition-colors ${
                              isActive
                                ? "text-cyan-400"
                                : "text-slate-400 group-hover:text-slate-700"
                            }`}
                          />
                          {!showLabels && hasBadge && (
                            <span
                              aria-hidden="true"
                              className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-cyan-500 ring-2 ring-white"
                            />
                          )}
                        </span>

                        {showLabels && (
                          <>
                            <span className="flex-1 truncate whitespace-nowrap">
                              {item.name}
                            </span>
                            {hasBadge && (
                              <span
                                className={`inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                                  isActive
                                    ? "bg-white/15 text-white"
                                    : badgeCls
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer Quick Links & Anchored User Account Card */}
        <div className="shrink-0 border-t border-slate-100 p-3 space-y-2 bg-white">
          {footerLinks.length > 0 && (
            <ul role="list" className="m-0 p-0 list-none space-y-1">
              {footerLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      title={!showLabels ? link.name : undefined}
                      onClick={() => {
                        if (isMobileDrawer) setMobileOpen(false);
                      }}
                      className={`flex min-h-[36px] items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                        link.highlight
                          ? "bg-cyan-50/80 text-cyan-800 hover:bg-cyan-100/80"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      } ${!showLabels ? "justify-center px-0" : ""}`}
                    >
                      <Icon
                        aria-hidden="true"
                        className={`h-4 w-4 shrink-0 ${
                          link.highlight ? "text-cyan-700" : "text-slate-400"
                        }`}
                      />
                      {showLabels && (
                        <span className="flex flex-1 items-center justify-between truncate whitespace-nowrap">
                          <span>{link.name}</span>
                          {link.external && (
                            <ExternalLink
                              aria-hidden="true"
                              className="h-3 w-3 opacity-55"
                            />
                          )}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Grounded User Profile & Sign Out Card */}
          <div
            className={`rounded-xl border border-slate-200/80 bg-slate-50/75 ${
              showLabels
                ? "p-2.5 flex items-center gap-2.5 justify-between"
                : "p-1.5 flex flex-col items-center gap-1.5"
            }`}
          >
            <Link
              href={profileHref}
              onClick={() => {
                if (isMobileDrawer) setMobileOpen(false);
              }}
              title={
                !showLabels
                  ? `${user.name}${user.email ? ` (${user.email})` : ""}`
                  : undefined
              }
              className="flex items-center gap-2.5 min-w-0 flex-1 no-underline hover:opacity-85 transition-opacity rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              <div className="relative h-9 w-9 shrink-0">
                <div className="flex h-9 w-9 overflow-hidden items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs uppercase border border-slate-200">
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    userInitial
                  )}
                </div>
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
                />
              </div>

              {showLabels && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-900 truncate">
                      {user.name}
                    </span>
                    {user.verified && (
                      <CheckCircle2
                        aria-hidden="true"
                        className="h-3 w-3 shrink-0 text-emerald-500"
                      />
                    )}
                  </div>
                  <p className="m-0 text-[10px] text-slate-500 truncate">
                    {user.roleLabel || user.email || "Account"}
                  </p>
                </div>
              )}
            </Link>

            <button
              type="button"
              disabled={isLoggingOut}
              onClick={onLogout}
              title="Sign Out"
              aria-label={isLoggingOut ? "Signing out" : "Sign out"}
              className="min-h-[34px] min-w-[34px] shrink-0 inline-flex items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 bg-transparent border-0 cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[100svh] w-full overflow-hidden bg-slate-50/75 text-slate-900 font-sans">
      {/* Skip link for keyboard accessibility */}
      <a
        href="#portal-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`relative hidden md:flex shrink-0 flex-col border-r border-slate-200/80 bg-white transition-[width] duration-200 ease-out z-30 ${
          collapsed ? "w-[76px]" : "w-[260px]"
        }`}
      >
        {renderSidebarBody(false)}

        {/* Floating Collapse / Expand Toggle on Sidebar Border */}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden md:inline-flex items-center justify-center absolute -right-3 top-[22px] z-40 h-6 w-6 rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </aside>

      {/* Mobile Navigation Drawer Overlay */}
      <div
        id="portal-mobile-drawer"
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-50 md:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => {
            setMobileOpen(false);
            mobileTriggerRef.current?.focus();
          }}
          className={`fixed inset-0 bg-slate-950/45 backdrop-blur-[2px] transition-opacity duration-200 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Drawer Sheet */}
        <aside
          ref={mobileDrawerRef}
          tabIndex={-1}
          aria-label={`${portalSubtitle} mobile menu`}
          className={`fixed inset-y-0 left-0 z-10 h-[100svh] w-[min(288px,82vw)] border-r border-slate-200 bg-white shadow-2xl transition-transform duration-200 ease-out outline-none ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {renderSidebarBody(true)}
        </aside>
      </div>

      {/* Main Content Workspace (marked inert while mobile drawer is open) */}
      <div
        className="flex flex-1 flex-col min-w-0 overflow-hidden"
        inert={mobileOpen}
      >
        {/* Sticky Top Header Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <button
              ref={mobileTriggerRef}
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="portal-mobile-drawer"
              className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-100 md:hidden cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="hidden sm:inline text-xs font-medium text-slate-400">
                {portalSubtitle}
              </span>
              <span
                aria-hidden="true"
                className="hidden sm:inline text-slate-300 text-xs"
              >
                /
              </span>
              <span className="font-semibold text-slate-900 truncate">
                {currentPageTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {headerAction && (
              <Link
                href={headerAction.href}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors no-underline"
              >
                {headerAction.icon}
                <span>{headerAction.label}</span>
              </Link>
            )}

            <Link
              href={notificationHref}
              className="relative min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              title="View notifications & orders"
              aria-label={
                notificationCount > 0
                  ? `${notificationCount} active items`
                  : "View orders"
              }
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              {notificationCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-500 ring-2 ring-white"
                />
              )}
            </Link>

            <Link
              href={profileHref}
              className="flex items-center gap-2.5 border-l border-slate-200 pl-3 no-underline hover:opacity-85 transition-opacity rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              <div className="flex h-8 w-8 overflow-hidden items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs uppercase border border-slate-200">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  userInitial
                )}
              </div>
              <div className="hidden text-left sm:block">
                <p className="m-0 text-xs font-semibold leading-none text-slate-900">
                  {user.name}
                </p>
                {user.email && (
                  <p className="m-0 text-[10px] text-slate-500 mt-0.5 max-w-[140px] truncate">
                    {user.email}
                  </p>
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Scrollable Workspace Area */}
        <main
          id="portal-main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default PortalSidebarShell;

