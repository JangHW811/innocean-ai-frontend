import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/sessionStore";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

interface AnalysisCategoryItemProps {
  categories: {
    [key: string]: {
      label: string;
    };
  };
  title: string;
  onShowConfirmAnalysisModal?: () => void;
}

export default function AnalysisCategoryItem({
  categories,
  onShowConfirmAnalysisModal,
  title,
}: AnalysisCategoryItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const items = Object.entries(categories).map(([key, value]) => {
    return {
      id: key,
      title: value.label,
    };
  });

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className="sidebar-item flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors group w-full text-left"
        aria-expanded={isOpen}
      >
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
            {title}
          </span>
          <span className="text-[10px] text-gray-400">
            {items?.length}개 분석 도구
          </span>
        </div>
        <ChevronRight
          className={cn(
            "ml-auto w-4 h-4 text-gray-300 transition-transform group-hover:text-gray-500",
            isOpen && "rotate-90"
          )}
        />
      </button>
      {isOpen && (
        <ul className="ml-4 mt-2 space-y-1 text-xs text-gray-500">
          {items?.map((analysis) => (
            <AnalysisItem
              key={analysis.id}
              analysis={analysis}
              onShowConfirmAnalysisModal={onShowConfirmAnalysisModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const AnalysisItem = ({
  analysis,
  onShowConfirmAnalysisModal,
}: {
  analysis: { id: string; title: string };
  onShowConfirmAnalysisModal?: () => void;
}) => {
  const { setSelectedJobType, selectedJobType } = useSessionStore();

  const containerClassName = cn(
    "cursor-pointer flex items-start gap-2 rounded-lg px-3 py-3 hover:bg-gray-50 hover:text-gray-800 transition-colors",
    selectedJobType === analysis.id && "bg-gray-100 hover:bg-gray-200"
  );

  const handleSelectAnalysis = () => {
    setSelectedJobType(analysis.id);
    onShowConfirmAnalysisModal?.();
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
        <div className="font-medium text-gray-700">{analysis.title}</div>
      </div>
    </li>
  );
};
