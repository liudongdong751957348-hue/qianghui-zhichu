import type { Metadata } from "next";
import { Noto_Sans_SC, Cormorant_Garamond } from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

const notoSansSC = Noto_Sans_SC({
  variable: "--font-body",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "墙绘直出",
  description: "面向墙绘公司、文旅项目方与乡村改造团队的墙绘效果图提案工具。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${notoSansSC.variable} ${cormorant.variable}`}>
        <div className="app-chrome">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
