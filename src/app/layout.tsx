import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Innocean Data Analysis - Renewal',
  description: 'AI와 대화하며 데이터를 분석하고 인사이트를 발견하세요',
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
      <body className="antialiased" style={{ fontFamily: "'Pretendard', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
