import { useMethods } from "@/apis/method";
import AnalysisCategoryItem from "./AnalysisCategoryItem";

interface AnalysisTreeProps {
  onSelectAnalysis: (analysisId: string) => void;
  theme?: "light" | "dark";
  selectedAnalysisId?: string | null;
}
const AnalysisTree = ({
  onSelectAnalysis,
  theme = "light",
  selectedAnalysisId,
}: AnalysisTreeProps) => {
  const { data: methods } = useMethods();
  const analysisCategories = Object.entries(methods ?? {}).map(
    ([key, value]) => {
      return {
        id: key,
        title: value.label,
        subcategories: value.items,
      };
    }
  );
  return (
    <div className="flex-1 px-3 py-2 space-y-3 overflow-y-auto min-h-0">
      <div className="space-y-2">
        {analysisCategories.map((category) => (
          <AnalysisCategoryItem
            key={category.title}
            title={category.title}
            categories={category.subcategories}
            onSelectAnalysis={onSelectAnalysis}
            theme={theme}
            selectedAnalysisId={selectedAnalysisId}
          />
        ))}
      </div>
    </div>
  );
};

export default AnalysisTree;
