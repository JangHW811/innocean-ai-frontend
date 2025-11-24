import { ChevronRight } from "lucide-react";
import type { AnalysisCategory } from "@/data";
import { cn } from "@/lib/utils";

interface AnalysisCategoryItemProps {
  category: AnalysisCategory;
  onClick?: () => void;
}

export default function AnalysisCategoryItem({
  category,
  onClick,
}: AnalysisCategoryItemProps) {
  const Icon = category.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="sidebar-item flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
    >
      <div
        className={cn(
          "icon-box w-8 h-8 rounded-md flex items-center justify-center transition-colors",
          category.bgColor,
          category.color,
          "group-hover:bg-indigo-50 group-hover:text-indigo-600"
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
          {category.title}
        </span>
        <span className="text-[10px] text-gray-400">
          {category.analyses.length}개 분석 도구
        </span>
      </div>
      <ChevronRight className="ml-auto w-4 h-4 text-gray-300 group-hover:text-gray-500" />
    </button>
  );
}
