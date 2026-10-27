import React from "react";

export const SystemSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System & Platform Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure global system parameters, maintenance toggles, and API limits.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-base">General Platform Configuration</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Platform Brand Name</label>
              <input
                type="text"
                defaultValue="SaaSify Enterprise"
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Support Contact Email</label>
              <input
                type="email"
                defaultValue="support@saasify.dev"
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-base text-red-500">Danger Zone</h3>
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <div className="font-semibold text-sm">System Maintenance Mode</div>
              <div className="text-xs text-muted-foreground">
                Temporarily pause user access while running database migrations.
              </div>
            </div>
            <button className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/20">
              Enable Maintenance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
