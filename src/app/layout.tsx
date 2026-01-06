import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/common/providers";
import Header from "@/components/header/Header";
import SettingsMenu from "@/components/main/SettingsMenu";

export const metadata: Metadata = {
  title: "Innocean Data Analysis - Renewal",
  description: "AI와 대화하며 데이터를 분석하고 인사이트를 발견하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body
        className="antialiased"
        style={{ fontFamily: "'Pretendard', sans-serif" }}
      >
        <Providers>
          <main className="bg-gray-50 text-gray-800 h-screen flex flex-col overflow-hidden">
            <Header />
            {children}
          </main>
        </Providers>
        <SettingsMenu />
      </body>
    </html>
  );
}
