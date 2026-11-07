import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#2563eb",
    colorInfo: "#2563eb",
    colorSuccess: "#10b981",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    borderRadius: 6,
    fontFamily: "inherit",
  },
  components: {
    Button: {
      controlHeight: 38,
      borderRadius: 6,
    },
    Input: {
      controlHeight: 38,
      borderRadius: 6,
    },
    Select: {
      controlHeight: 38,
      borderRadius: 6,
    },
  },
};

