"use client";

import { ConfigProvider, App, theme } from "antd";
import ptBR from "antd/locale/pt_BR";
import { StyleProvider } from "@ant-design/cssinjs";

interface AntdProviderProps {
  children: React.ReactNode;
  fontFamily?: string;
}

export function AntdProvider({ children, fontFamily }: AntdProviderProps) {
  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider
        locale={ptBR}
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            fontFamily,
          },
          components: {
            Table: {
              borderRadius: 6,
            },
            Card: {
              borderRadius: 6,
            },
            Button: {
              borderRadius: 4,
            },
          },
        }}
        componentSize="middle"
      >
        <App message={{ maxCount: 3 }}>{children}</App>
      </ConfigProvider>
    </StyleProvider>
  );
}
