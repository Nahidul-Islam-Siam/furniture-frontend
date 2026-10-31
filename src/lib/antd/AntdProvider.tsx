"use client";

import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import { antdTheme } from "./theme";

export default function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <StyleProvider hashPriority="high">
        <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
      </StyleProvider>
    </AntdRegistry>
  );
}
