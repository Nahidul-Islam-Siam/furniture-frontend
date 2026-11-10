import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#0f172a",
    colorInfo: "#0284c7",
    colorSuccess: "#059669",
    colorWarning: "#d97706",
    colorError: "#dc2626",
    colorBorderSecondary: "#e2e8f0",
    colorBgContainer: "#ffffff",
    borderRadius: 10,
    borderRadiusLG: 14,
    fontFamily: "inherit",
  },
  components: {
    Button: {
      controlHeight: 38,
      borderRadius: 10,
      fontWeight: 500,
    },
    Input: {
      controlHeight: 38,
      borderRadius: 10,
    },
    Select: {
      controlHeight: 38,
      borderRadius: 10,
    },
    Card: {
      borderRadiusLG: 14,
      paddingLG: 20,
    },
    Table: {
      headerBg: "#f8fafc",
      headerColor: "#475569",
      headerSplitColor: "transparent",
      rowHoverBg: "#f8fafc",
      borderColor: "#f1f5f9",
      cellPaddingBlock: 14,
      cellPaddingInline: 16,
    },
    Tag: {
      borderRadiusSM: 999,
    },
  },
};
