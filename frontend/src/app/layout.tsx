import type { Metadata } from "next";
import "./globals.css";
import { Nunito } from "next/font/google";
import localFont from "next/font/local";
import dynamic from "next/dynamic";
import { AntdProvider } from "@/providers/AntdProvider";
//import "antd/dist/antd.min.css";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500"],
  style: ["normal", "italic"],
});

const praxisCom = localFont({
  src: "./fonts/PraxisCom-Regular.ttf",
  variable: "--font-family-Praxis",
});

export const metadata: Metadata = {
  title: "Sistema Integrado Silimed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={praxisCom.variable}>
      <body className={nunito.className}>
        <AntdProvider fontFamily={nunito.style.fontFamily}>
          {children}
        </AntdProvider>
      </body>
    </html>
  );
}
