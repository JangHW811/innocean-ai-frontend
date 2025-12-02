import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useAnalysisJobsStart, useSessionInfo } from "@/apis/sessions";
import type { Analysis, AnalysisCategory } from "@/data/analysisCategories";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/sessionStore";

interface AnalysisCategoryItemProps {
  category: AnalysisCategory;
  onClick?: () => void;
}

export default function AnalysisCategoryItem({
  category,
  onClick,
}: AnalysisCategoryItemProps) {
  const Icon = category.icon;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          onClick?.();
        }}
        className="sidebar-item flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors group w-full text-left"
        aria-expanded={isOpen}
      >
        <div
          className={cn(
            "icon-box w-8 h-8 rounded-md flex items-center justify-center transition-colors",
            category.bgColor,
            category.color,
            "group-hover:bg-indigo-50 group-hover:text-indigo-600",
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
        <ChevronRight
          className={cn(
            "ml-auto w-4 h-4 text-gray-300 transition-transform group-hover:text-gray-500",
            isOpen && "rotate-90",
          )}
        />
      </button>
      {isOpen && (
        <ul className="ml-11 mt-2 space-y-1 text-xs text-gray-500">
          {category.analyses.map((analysis) => (
            <AnalysisItem key={analysis.id} analysis={analysis} />
          ))}
        </ul>
      )}
    </div>
  );
}

const AnalysisItem = ({ analysis }: { analysis: Analysis }) => {
  const { selectedSessionId } = useSessionStore();
  const { data: sessionInfo } = useSessionInfo(selectedSessionId);
  const { mutateAsync: startAnalysisJob } = useAnalysisJobsStart();
  const AnalysisIcon = analysis.icon;
  const handleClick = () => {
    startAnalysisJob({
      session_id: selectedSessionId!,
      file_id: sessionInfo?.file_ids?.[0] || "",
      params: {
        task_type: "needs_and_triggers",
        // task_type: analysis.id,
        options: {},
      },
    });
  };

  const containerClassName = cn(
    "cursor-pointer flex items-start gap-2 rounded-lg px-3 py-1.5 hover:bg-gray-50 hover:text-gray-800 transition-colors",
  );
  return (
    <li
      role="button"
      onClick={() => {
        handleClick();
      }}
      key={analysis.id}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          console.log(analysis.id);
        }
      }}
      className={containerClassName}
    >
      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <AnalysisIcon className="h-3.5 w-3.5" />
      </span>
      <div>
        <div className="font-medium text-gray-700">{analysis.title}</div>
        <div className="text-[11px] text-gray-400">{analysis.description}</div>
      </div>
    </li>
  );
};
