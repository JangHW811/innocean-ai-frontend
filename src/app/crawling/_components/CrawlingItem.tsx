import dayjs from "dayjs";
import { FileSpreadsheet, Trash2 } from "lucide-react";
import { useState } from "react";
import { type CrawlingListItem, useCrawlingDelete } from "@/apis/crawling";
import { Button } from "@/components/ui/button";
import { useAlertActions } from "@/stores/alertStore";
import { useAuthStore } from "@/stores/authStore";

const SEGMENT_NUM_LABELS: Record<string, string> = {
  "0": "전체(최근 1년)",
  "1": "전체 (기간 설정)",
  "2": "광고시스템 연령대 별",
  "3": "5세 단위 연령대 별",
};

const TIME_UNIT_LABELS: Record<string, string> = {
  month: "월별",
  date: "일별",
};

const USAGE_LABELS: Record<string, string> = {
  "0": "경쟁PT",
  "1": "캠페인(계열)",
  "2": "캠페인(비계열)",
  "3": "홍보/교육/연구",
  "4": "기타",
};

interface RowWithDetailProps {
  item: CrawlingListItem;
  index: number;
}

const CrawlingItem = ({ item, index }: RowWithDetailProps) => {
  const { id } = useAuthStore();
  const { confirm } = useAlertActions();
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteCrawling } = useCrawlingDelete();

  const handleDeleteCrawling = () => {
    confirm({
      title: "정말 삭제하시겠습니까?",
      description: "삭제하면 복구할 수 없습니다.",
      onConfirm: () => {
        deleteCrawling(item.id);
      },
    });
  };
  console.log("AAAAA", id, item.user_id);
  return (
    <>
      <tr
        className="hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <td className="pl-2 pr-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
          {index + 1}
        </td>
        <td className="px-4 py-4 text-sm text-gray-900">{item.title}</td>
        <td className="px-3 py-4 text-sm text-gray-700">
          {SEGMENT_NUM_LABELS[String(item.segment_num)]}
          {item.start_date && ` ${item.start_date}`}
        </td>
        <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-700">
          {TIME_UNIT_LABELS[item.time_unit] || item.time_unit}
        </td>
        <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-700">
          {USAGE_LABELS[String(item.usage)] || item.usage}
        </td>
        <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-700">
          {item.user_id}
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
          {dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss")}
        </td>
        <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
          {item.output_file_path ? (
            <a
              target="_blank"
              href={`${process.env.NEXT_PUBLIC_API_URL}/api/search-jobs/${item.id}/download`}
              className="h-8 px-2 text-green-600 flex items-center justify-center w-8 hover:bg-green-50 rounded-md mx-auto"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
            </a>
          ) : (
            <span className="text-primary font-medium">수집중</span>
          )}
        </td>
        <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
          {id === item.user_id && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCrawling();
              }}
              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 "
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={9} className="px-6 py-4 bg-gray-50">
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">광고주:</span>
                  <span className="ml-2 text-gray-600">
                    {item.advertiser || "-"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">담당팀:</span>
                  <span className="ml-2 text-gray-600">{item.team || "-"}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700">내용:</span>
                  <p className="mt-1 text-gray-600 whitespace-pre-wrap">
                    {item.content || "-"}
                  </p>
                </div>
                {item.input_file_path && (
                  <div className="col-span-2">
                    <span className="font-semibold text-gray-700">
                      입력 파일:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {item.input_file_path}
                    </span>
                  </div>
                )}
                {item.output_file_path && (
                  <div className="col-span-2">
                    <span className="font-semibold text-gray-700">
                      출력 파일:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {item.output_file_path}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
export default CrawlingItem;
