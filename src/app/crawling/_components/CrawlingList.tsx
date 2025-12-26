import { ChevronLeft, ChevronRight, FileSearch } from "lucide-react";
import useCrawlingList, { type CrawlingListParams } from "@/apis/crawling";
import { Button } from "@/components/ui/button";
import CrawlingItem from "./CrawlingItem";

interface CrawlingListProps {
  params: CrawlingListParams;
  onPageChange?: (page: number) => void;
}

const CrawlingList = ({ params, onPageChange }: CrawlingListProps) => {
  const { data } = useCrawlingList(params);
  const crawlingList = data?.items;

  const hasSearchParams = Boolean(
    params.title || params.advertiser || params.team || params.manager,
  );
  const isEmpty = !crawlingList || crawlingList.length === 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg mb-4 overflow-hidden">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-gray-100 p-6">
              <FileSearch className="h-12 w-12 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {hasSearchParams
                  ? "검색 결과가 없습니다"
                  : "등록된 수집 내역이 없습니다"}
              </h3>
              <p className="text-sm text-gray-500 max-w-md">
                {hasSearchParams
                  ? "다른 검색 조건으로 시도해보세요."
                  : "새로운 수집 내역을 등록하여 시작해보세요."}
              </p>
            </div>
          </div>
        </div>
      ) : (
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
                <th className="min-w-[50px] px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  삭제
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {crawlingList.map((item, index) => {
                const pageNumber = data?.page ?? 1;
                const pageSize = data?.size ?? 10;
                const itemNumber = (pageNumber - 1) * pageSize + index + 1;
                return (
                  <CrawlingItem
                    key={item.id}
                    item={item}
                    index={itemNumber - 1}
                  />
                );
              })}
            </tbody>
          </table>
          {data && data.pages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>
                  전체 {data.total}개 중{" "}
                  {((data.page - 1) * data.size + 1).toLocaleString()}-
                  {Math.min(data.page * data.size, data.total).toLocaleString()}
                  개
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(data.page - 1)}
                  disabled={data.page <= 1}
                  className="h-8 px-3"
                >
                  <ChevronLeft className="h-4 w-4" />
                  이전
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, data.pages) }, (_, i) => {
                    let pageNum: number;
                    if (data.pages <= 5) {
                      pageNum = i + 1;
                    } else if (data.page <= 3) {
                      pageNum = i + 1;
                    } else if (data.page >= data.pages - 2) {
                      pageNum = data.pages - 4 + i;
                    } else {
                      pageNum = data.page - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        type="button"
                        variant={data.page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange?.(pageNum)}
                        className={`h-8 w-8 px-0 ${
                          data.page === pageNum
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(data.page + 1)}
                  disabled={data.page >= data.pages}
                  className="h-8 px-3"
                >
                  다음
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CrawlingList;
