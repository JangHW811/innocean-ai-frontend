import { analysisCategories } from "@/data/analysisCategories";
import AnalysisCategoryItem from "./AnalysisCategoryItem";

const AvailableAnalysis = () => {
  return (
    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
      <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
        Available Analysis
      </div>

      {analysisCategories.map((category) => (
        <AnalysisCategoryItem key={category.id} category={category} />
      ))}
    </div>
  );
};

export default AvailableAnalysis;
