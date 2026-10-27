import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Collections from "./pages/collections";
import Warranty from "./pages/warranty";
import RootLayout from "./pages/Layout";
import NotFound from "./pages/not-found";
import About from "./pages/about";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Contact from "./pages/contact";
import Blog from "./pages/blog";
import ErrorPage from "./pages/error";

// Role-Based Guards
import { RoleGuard } from "./routes/guards/RoleGuard";

// Layouts
import { AdminLayout } from "./layouts/AdminLayout";
import { UserLayout } from "./layouts/UserLayout";

// Admin Domain Features
import AnalyticsPage from "./features/admin/analytics/pages/AnalyticsPage";
import UsersListPage from "./features/admin/user-management/pages/UsersListPage";
import SystemSettingsPage from "./features/admin/system-settings/pages/SystemSettingsPage";

// User Domain Features
import OverviewPage from "./features/user/overview/pages/OverviewPage";
import ProfilePage from "./features/user/profile/pages/ProfilePage";
import BillingPage from "./features/user/billing/pages/BillingPage";
import SettingsPage from "./features/user/settings/pages/SettingsPage";

export const router = createBrowserRouter([
  // 1. Public Marketing Routes
  {
    path: "",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/collections",
        element: <Collections />,
      },
      {
        path: "/collections/:category",
        element: <Collections />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/pages/know-more-about-grid",
        element: <About />,
      },
      {
        path: "/pages/grid-studio",
        element: <Collections />,
      },
      {
        path: "/pages/warranty",
        element: <Warranty />,
      },
      {
        path: "/policies/terms-of-service",
        element: <Warranty />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/pages/contact-us",
        element: <Contact />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },

  // 2. Protected User Dashboard Routes (/dashboard/*)
  {
    path: "/dashboard",
    element: (
      <RoleGuard
        allowedRoles={["USER", "ADMIN", "DEVELOPER", "AGENT", "MORTGAGE"]}
      />
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        element: <UserLayout />,
        children: [
          {
            index: true,
            element: <OverviewPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "billing",
            element: <BillingPage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },

  // 3. Protected Admin Dashboard Routes (/admin/*)
  {
    path: "/admin",
    element: <RoleGuard allowedRoles={["ADMIN"]} />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AnalyticsPage />,
          },
          {
            path: "users",
            element: <UsersListPage />,
          },
          {
            path: "settings",
            element: <SystemSettingsPage />,
          },
        ],
      },
    ],
  },

  // 4. Catch-all 404 Route
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;