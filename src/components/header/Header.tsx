"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isCrawlingPage = pathname === "/crawling";

  return (
    <header className="min-h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white shadow-sm gap-2">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-indigo-900 tracking-tight">
          INNOCEAN
        </span>
        <h1 className="text-base font-semibold text-gray-800">
          Conversational Data Analysis
        </h1>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => router.push(isCrawlingPage ? "/" : "/crawling")}
        className="ml-auto"
      >
        {isCrawlingPage ? (
          "분석화면 가기"
        ) : (
          <>
            <Image
              src="/naver.svg"
              alt="네이버"
              width={16}
              height={16}
              className="shrink-0"
            />
            네이버 크롤링 화면 가기
          </>
        )}
      </Button>
    </header>
  );
};

export default Header;
