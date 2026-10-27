import React from "react";
import { Shield, MoreHorizontal, UserCheck, UserX } from "lucide-react";

export const UsersListPage: React.FC = () => {
  const users = [
    { id: "usr_1", name: "Nahidul Islam", email: "nahidul@example.com", role: "ADMIN", status: "Active", joined: "Oct 12, 2026" },
    { id: "usr_2", name: "Sarah Connor", email: "sarah@cyberdyne.io", role: "USER", status: "Active", joined: "Oct 18, 2026" },
    { id: "usr_3", name: "Alex Mercer", email: "alex@gentek.org", role: "USER", status: "Suspended", joined: "Sep 29, 2026" },
    { id: "usr_4", name: "David Miller", email: "david@saasify.dev", role: "DEVELOPER", status: "Active", joined: "Aug 15, 2026" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground">
            Inspect users, toggle permissions, manage subscriptions and access roles.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90">
          Invite New User
        </button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Joined Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      u.role === "ADMIN" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-primary/10 text-primary"
                    }`}>
                      {u.role === "ADMIN" && <Shield className="h-3 w-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      u.status === "Active" ? "text-emerald-500" : "text-amber-500"
                    }`}>
                      {u.status === "Active" ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{u.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded p-1 text-muted-foreground hover:bg-accent">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersListPage;
