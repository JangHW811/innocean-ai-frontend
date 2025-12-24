"use client";

import { Copy, Download, FileSpreadsheet, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import NaverCrawlingRegistModal from "@/components/modals/NaverCrawlingRegistModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/authStore";

export default function CrawlingPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [searchType, setSearchType] = useState("제목");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // 예시 데이터
  const exampleData = [
    {
      id: 1275,
      title: "[네이버검색량] F1_검색량_1210",
      condition: "5세 단위 연령대 별 2024-12-01",
      collectionUnit: "month",
      usage: "경쟁PT",
      author: "구본률",
      registrationDate: "2025-12-10 15:57:26",
      file: "excel",
      status: "completed",
    },
    {
      id: 1274,
      title: "[네이버검색량] 정관장",
      condition: "5세 단위 연령대 별 2024-12-01",
      collectionUnit: "date",
      usage: "경쟁PT",
      author: "송정훈",
      registrationDate: "2025-12-10 14:30:15",
      file: "excel",
      status: "completed",
    },
    {
      id: 1273,
      title: "[네이버검색량] 뉴케어 경쟁사",
      condition: "5세 단위 연령대 별 2024-12-01",
      collectionUnit: "month",
      usage: "경쟁PT",
      author: "이우빈",
      registrationDate: "2025-12-10 13:20:45",
      file: null,
      status: "collecting",
    },
  ];

  return (
    <main className="bg-gray-50 text-gray-800 h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto p-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              네이버 크롤링 현황
            </h1>
          </div>

          {/* 검색조건 */}
          <div className="mb-4 flex items-center gap-2">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="제목">제목</SelectItem>
                <SelectItem value="작성자">작성자</SelectItem>
                <SelectItem value="키워드">키워드</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="flex-1 max-w-md"
            />
            <Button type="button">검색</Button>
          </div>

          {/* 게시판 테이블 */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg mb-4 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="min-w-[60px] pl-2 pr-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      번호
                    </th>
                    <th className="min-w-[200px] px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      제목/키워드
                    </th>
                    <th className="min-w-[150px] px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      조건
                    </th>
                    <th className="min-w-[80px] px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider break-keep">
                      수집단위
                    </th>
                    <th className="min-w-[80px] px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      사용처
                    </th>
                    <th className="min-w-[60px] px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      작성자
                    </th>
                    <th className="min-w-[140px] px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      등록일
                    </th>
                    <th className="min-w-[60px] px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      파일
                    </th>
                    <th className="min-w-[140px] px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      상세데이터 다운로드
                    </th>
                    <th className="min-w-[50px] px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      복사
                    </th>
                    <th className="min-w-[50px] px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      삭제
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {exampleData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="pl-2 pr-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {item.title}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-700">
                        {item.condition}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.collectionUnit}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.usage}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.author}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.registrationDate}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {item.file ? (
                          <div className="flex items-center justify-center gap-2">
                            <FileSpreadsheet className="h-6 w-6 text-green-600" />
                          </div>
                        ) : (
                          <span className="text-primary font-medium">
                            수집중
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {item.file ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            데이터 다운로드
                          </Button>
                        ) : null}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 등록 버튼 */}
          <div className="flex justify-end">
            <Button type="button" onClick={() => setIsModalOpen(true)}>
              등록
            </Button>
          </div>
        </div>
      </div>

      <NaverCrawlingRegistModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </main>
  );
}
