import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Bell,
  Home,
  ShoppingCart,
  BookA ,
  Ratio ,
  CircleDollarSign ,
  Brain ,
  // UserCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector, logout } from "@/redux";

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    {
      name: "Overview &  Analytics",
      path: "/admin",
      icon: BarChart3,
      end: true,
    },
    { name: "User Management", path: "/admin/users", icon: Users },
    { name: "Product Management", path: "/admin/Product-Management", icon: ShoppingCart },
    { name: "Order Management", path: "/admin/Product-Management", icon: BookA  },
    { name: "Marketing & Promotions", path: "/admin/Product-Management", icon: Ratio  },
    { name: "Payment & Financials", path: "/admin/Product-Management", icon: CircleDollarSign },
    { name: "Reports & Insights", path: "/admin/Product-Management", icon: Brain  },
    { name: "Role & Permission Management", path: "/admin/Product-Management", icon: Users},
    { name: "System Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300 md:static ${
          sidebarOpen ? "w-64" : "w-20"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link
            to="/admin"
            className="flex items-center gap-2 font-bold tracking-tight"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white font-extrabold shadow">
              <ShieldAlert className="h-5 w-5" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight">
                  Admin Portal
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  SaaS Control
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden rounded p-1 text-muted-foreground hover:bg-accent md:inline-flex"
            title="Toggle Sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  } ${!sidebarOpen ? "justify-center" : ""}`
                }
                title={!sidebarOpen ? item.name : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer links */}
        <div className="border-t p-3 space-y-1">
          {/* <Link
            to="/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground ${
              !sidebarOpen ? "justify-center" : ""
            }`}
            title="Switch to User Dashboard"
          >
            <UserCheck className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>User Dashboard</span>}
          </Link> */}

          <Link
            to="/"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground ${
              !sidebarOpen ? "justify-center" : ""
            }`}
            title="Back to Main Website"
          >
            <Home className="h-4 w-4 shrink-0" />
            {sidebarOpen && (
              <span className="flex items-center gap-1">
                View Website <ExternalLink className="h-3 w-3 opacity-60" />
              </span>
            )}
          </Link>

          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors ${
              !sidebarOpen ? "justify-center" : ""
            }`}
            title="Sign Out"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b bg-card/60 px-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded p-1 text-muted-foreground hover:bg-accent md:hidden"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <span className="inline-flex items-center rounded-md bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-500 border border-red-500/20">
              Admin Shield Active
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 text-muted-foreground hover:bg-accent">
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 border-l pl-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
                {user?.name?.[0] || "A"}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold leading-none">
                  {user?.name || "Administrator"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {user?.email || "admin@system.com"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
