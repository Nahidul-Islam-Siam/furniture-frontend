import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User as UserIcon,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Bell,
  Home,
} from "lucide-react";
import { useAppDispatch, useAppSelector, logout } from "@/redux";

export const UserLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard Overview", path: "/dashboard", icon: LayoutDashboard, end: true },
    { name: "My Profile", path: "/dashboard/profile", icon: UserIcon },
    { name: "Billing & Plans", path: "/dashboard/billing", icon: CreditCard },
    { name: "Account Settings", path: "/dashboard/settings", icon: Settings },
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
          <Link to="/dashboard" className="flex items-center gap-2 font-bold tracking-tight">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-extrabold shadow">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight">User Portal</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Client Dashboard
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
          <Link
            to="/"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground ${
              !sidebarOpen ? "justify-center" : ""
            }`}
            title="Return to Website"
          >
            <Home className="h-4 w-4 shrink-0" />
            {sidebarOpen && (
              <span className="flex items-center gap-1">
                Main Website <ExternalLink className="h-3 w-3 opacity-60" />
              </span>
            )}
          </Link>

          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors ${
              !sidebarOpen ? "justify-center" : ""
            }`}
            title="Log Out"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Log Out</span>}
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
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <span className="text-sm font-medium text-muted-foreground">
              Welcome back, <span className="font-semibold text-foreground">{user?.name || "User"}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 text-muted-foreground hover:bg-accent">
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 border-l pl-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
                {user?.name?.[0] || "U"}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold leading-none">{user?.name || "My Account"}</p>
                <p className="text-[10px] text-muted-foreground">{user?.email || "user@domain.com"}</p>
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

export default UserLayout;
