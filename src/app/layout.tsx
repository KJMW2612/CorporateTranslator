import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "회사어 번역기 | 직장인을 위한 비즈니스 말투 AI 번역",
  description:
    "어색하고 직관적인 평어/구어체 초안을 직장 상황 및 대상에 최적화된 정중하고 명확한 회사어로 자동 번역해 주는 인공지능 오피스 툴입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="light">
      <head>
        {/* 구글 애드센스 자동 광고 연동 스크립트 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950`}
      >
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
