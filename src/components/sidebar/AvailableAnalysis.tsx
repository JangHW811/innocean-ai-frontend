import { useMethods } from "@/apis/method";
import AnalysisCategoryItem from "./AnalysisCategoryItem";

const AvailableAnalysis = () => {
  const { data: methods } = useMethods();
  console.log("methods", methods);
  const analysisCategories = Object.entries(methods ?? {}).map(
    ([key, value]) => {
      return {
        id: key,
        title: value.label,
        subcategories: value.items,
      };
    }
  );
  console.log("analysisCategories", analysisCategories);
  return (
    <div className="flex flex-col h-full min-h-0">
      <p className="text-left p-4 pb-2 sticky bg-white top-0 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 z-10 shrink-0">
        Available Analysis
      </p>
      <div className="flex-1 px-3 py-2 space-y-3 overflow-y-auto min-h-0">
        <div className="space-y-2">
          {analysisCategories.map((category) => (
            <AnalysisCategoryItem
              key={category.title}
              title={category.title}
              categories={category.subcategories}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableAnalysis;
