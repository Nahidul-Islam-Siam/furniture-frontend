import React from "react";
import { useAppSelector } from "@/redux";
import { User, Mail, Shield, Camera } from "lucide-react";

export const ProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal details, profile picture, and identity verification.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-2xl uppercase border">
            {user?.name?.[0] || "U"}
            <button className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-primary-foreground shadow">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <h3 className="font-semibold text-lg">{user?.name || "User Name"}</h3>
            <p className="text-sm text-muted-foreground">{user?.email || "user@example.com"}</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-1">
              <Shield className="h-3 w-3" /> {user?.role || "USER"} Account
            </span>
          </div>
        </div>

        {/* Details Form */}
        <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
          <div>
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Full Name
            </label>
            <input
              type="text"
              defaultValue={user?.name || ""}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Email Address
            </label>
            <input
              type="email"
              defaultValue={user?.email || ""}
              disabled
              className="mt-1 w-full rounded-md border bg-muted px-3 py-2 text-sm shadow-sm cursor-not-allowed opacity-80"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
