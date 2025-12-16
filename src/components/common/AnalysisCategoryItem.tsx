import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AnalysisCategoryItemProps {
  categories: {
    [key: string]: {
      label: string;
    };
  };
  title: string;
  onSelectAnalysis: (analysisId: string) => void;
  theme?: "light" | "dark";
  selectedAnalysisId?: string | null;
}

export default function AnalysisCategoryItem({
  categories,
  onSelectAnalysis,
  title,
  theme = "light",
  selectedAnalysisId,
}: AnalysisCategoryItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const items = Object.entries(categories).map(([key, value]) => {
    return {
      id: key,
      title: value.label,
    };
  });

  const isDark = theme === "dark";

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className={cn(
          "sidebar-item flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group w-full text-left",
          isDark ? "bg-slate-800/50 hover:bg-slate-800/70" : "hover:bg-gray-50",
        )}
        aria-expanded={isOpen}
      >
        <div className="flex flex-col">
          <span
            className={cn(
              "text-sm font-semibold",
              isDark
                ? "text-slate-200 group-hover:text-white"
                : "text-gray-700 group-hover:text-gray-900",
            )}
          >
            {title}
          </span>
          <span
            className={cn(
              "text-[10px]",
              isDark ? "text-slate-400" : "text-gray-400",
            )}
          >
            {items?.length}개 분석 도구
          </span>
        </div>
        <ChevronRight
          className={cn(
            "ml-auto w-4 h-4 transition-transform",
            isOpen && "rotate-90",
            isDark
              ? "text-slate-400 group-hover:text-slate-300"
              : "text-gray-300 group-hover:text-gray-500",
          )}
        />
      </button>
      {isOpen && (
        <ul
          className={cn(
            "ml-4 mt-2 space-y-1 text-xs",
            isDark ? "text-slate-400" : "text-gray-500",
          )}
        >
          {items?.map((analysis) => (
            <AnalysisItem
              key={analysis.id}
              analysis={analysis}
              onSelectAnalysis={onSelectAnalysis}
              theme={theme}
              selectedAnalysisId={selectedAnalysisId}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const AnalysisItem = ({
  analysis,
  onSelectAnalysis,
  theme = "light",
  selectedAnalysisId,
}: {
  analysis: { id: string; title: string };
  onSelectAnalysis: (analysisId: string) => void;
  theme?: "light" | "dark";
  selectedAnalysisId?: string | null;
}) => {
  const isDark = theme === "dark";
  const isSelected = selectedAnalysisId === analysis.id;

  const developmentComplateList = [
    "mock_analysis",
    "mock_analysis_all",
    "category_usage_moment",
    "brand_preference_factors",
    "brand_image",
    "category_needs_triggers",
    "category_unmet_barriers",
    "category_kbf"
  ];

  const containerClassName = cn(
    "cursor-pointer flex items-start gap-2 rounded-lg px-3 py-3 transition-colors",
    isDark
      ? isSelected
        ? "bg-slate-800 hover:bg-slate-700 text-slate-100"
        : "hover:bg-slate-800/50 hover:text-slate-200 text-slate-300"
      : isSelected
        ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
        : "hover:bg-gray-50 hover:text-gray-800 text-gray-700",
  );

  const handleSelectAnalysis = () => {
    if (!developmentComplateList.includes(analysis.id)) {
      toast.error("해당 분석은 개발 중입니다.");
      return;
    }
    onSelectAnalysis(analysis.id);
  };
  return (
    <li
      role="button"
      onClick={() => {
        handleSelectAnalysis();
      }}
      key={analysis.id}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelectAnalysis();
        }
      }}
      className={containerClassName}
    >
      <div>
        <div className="font-medium">{analysis.title}</div>
      </div>
    </li>
  );
};
