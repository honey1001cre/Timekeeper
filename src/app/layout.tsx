import type { Metadata } from "next";
import { Outfit, Noto_Sans_JP, Shippori_Mincho } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const notoNS = Noto_Sans_JP({
  variable: "--font-noto",
  subsets: ["latin"],
});

const shipporiMincho = Shippori_Mincho({
  weight: ["400", "700", "800"],
  variable: "--font-shippori",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chronos Timekeeper | 美しい集中時間記録アプリ",
  description: "あなたの時間を、美しく、正確に。モダンなデザインと直感的な操作で、作業時間や学習時間を記録・可視化するタイムトラッカーアプリです。",
  keywords: ["Timekeeper", "タイムトラッカー", "時間管理", "集中力", "生産性向上", "カレンダー", "可視化"],
  authors: [{ name: "honey1001cre" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${outfit.variable} ${notoNS.variable} ${shipporiMincho.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
