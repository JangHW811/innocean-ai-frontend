"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { CrawlingListParams } from "@/apis/crawling";
import Header from "@/components/header/Header";
import NaverCrawlingRegistModal from "@/components/modals/NaverCrawlingRegistModal";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import CrawlingList from "./_components/CrawlingList";
import Search from "./_components/Search";

const SEARCH_DEFAULT_VALUES: CrawlingListParams = {
  title: "",
  advertiser: "",
  team: "",
  manager: "",
};

export default function CrawlingPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<CrawlingListParams>({
    ...SEARCH_DEFAULT_VALUES,
    page: 1,
    size: 10,
  });
  const methods = useForm({
    defaultValues: SEARCH_DEFAULT_VALUES,
  });

  useEffect(() => {
    // localStorage에서 데이터를 로드할 때까지 기다림
    if (!hasHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, hasHydrated, router]);

  if (!hasHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  const onSubmit = (data: CrawlingListParams) => {
    setSearchParams({ ...data, page: 1, size: 10 });
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
  };

  return (
    <>
      <Header />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex-1 overflow-y-auto p-6 pb-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  네이버 크롤링 현황
                </h1>
              </div>
              <Search />
              <CrawlingList
                params={searchParams}
                onPageChange={handlePageChange}
              />
              <div className="flex justify-end">
                <Button type="button" onClick={() => setIsModalOpen(true)}>
                  등록
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
      <NaverCrawlingRegistModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
