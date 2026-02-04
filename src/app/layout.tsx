import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chronos Timekeeper | 美しい集中時間記録アプリ",
  description: "あなたの時間を、美しく、正確に。モダンなデザインと直感的な操作で、作業時間や学習時間を記録・可視化するタイムトラッカーアプリです。",
  keywords: ["Timekeeper", "タイムトラッカー", "時間管理", "集中力", "生産性向上", "カレンダー", "可視化"],
  authors: [{ name: "honey1001cre" }],
  verification: {
    google: "YhHUOOIbJm3UpNgO9ffi2qW_5FW-zets9D-1a5106no",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-512.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Chronos",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${outfit.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
