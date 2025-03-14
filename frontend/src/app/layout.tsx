"use client";

import { Inter } from "next/font/google";
import "./reset.css";
import "./globals.css";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <ThemeProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-background">
              <main>{children}</main>
            </div>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
