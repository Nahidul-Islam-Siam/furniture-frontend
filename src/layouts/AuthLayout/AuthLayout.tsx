import React from "react";
import { Link, Outlet } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 md:p-8">
      <div className="mb-6 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span>SaaSify</span>
        </Link>
      </div>

      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl md:p-8">
        <Outlet />
      </div>

      <footer className="mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} SaaSify Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
