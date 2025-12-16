import { useState } from "react";
import { useSessionStore } from "@/stores/sessionStore";
import AnalysisTree from "../common/AnalysisTree";
import PreProcRequirementModal from "../modals/preProcRequirementModal";

const AvailableAnalysis = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setSelectedJobType, selectedJobType } = useSessionStore();
  const handleSelectAnalysis = (analysis: string) => {
    setSelectedJobType(analysis);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col h-full min-h-0">
        <p className="text-left p-4 pb-2 sticky bg-white top-0 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 z-10 shrink-0">
          Available Analysis
        </p>
        <AnalysisTree
          onSelectAnalysis={handleSelectAnalysis}
          selectedAnalysisId={selectedJobType}
        />
      </div>
      <PreProcRequirementModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

export default AvailableAnalysis;
