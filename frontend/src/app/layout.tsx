"use client";

import { Inter } from "next/font/google";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ConfigProvider
          locale={ptBR}
          theme={{
            token: {
              colorPrimary: "#1890ff",
              borderRadius: 6,
            },
          }}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
