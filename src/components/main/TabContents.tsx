import { useJobInfo } from "@/apis/jobs";
import { AnalysisJob } from "@/apis/sessions";
import { useMemo } from "react";
import { TabsContent } from "../ui/tabs";
import ArtifactContents from "./ArtifactContents";
interface TabSectionProps extends AnalysisJob {}

const TabContents = ({ job_id }: TabSectionProps) => {
  const { data: jobInfo, refetch } = useJobInfo(job_id);

  const { isFailed, isRunning, isSuccess } = jobInfo || {};
  const contents = useMemo(() => {
    if (isSuccess) {
      const successSteps = jobInfo?.steps?.filter(
        (step) => step.status === "SUCCEEDED"
      );
      const artifacts = successSteps?.flatMap((step) => step.artifacts) ?? [];
      return artifacts;
    }
    return [];
  }, [jobInfo?.steps, isSuccess]);

  console.log("contents", isRunning, contents);
  return (
    <TabsContent
      value={job_id}
      className="flex-1 flex flex-col min-h-0 overflow-hidden mt-6"
    >
      <div className="flex-1 overflow-y-auto min-h-0">
        {isRunning ? (
          <TabContentsSkeleton />
        ) : (
          <>{isFailed && <div className="text-red-500">분석 실패</div>}</>
        )}
        {contents.map((artifact) => (
          <ArtifactContents key={artifact.artifact_id} {...artifact} />
        ))}
      </div>
    </TabsContent>
  );
};

const TabContentsSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-6">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-3 w-3 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-3 w-3 rounded-full bg-indigo-500 animate-bounce"></div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-slate-600">
        <span className="text-base font-medium">분석중입니다</span>
        <span className="flex gap-1">
          <span className="animate-[dots_1.4s_ease-in-out_infinite]">.</span>
          <span className="animate-[dots_1.4s_ease-in-out_infinite_0.2s]">
            .
          </span>
          <span className="animate-[dots_1.4s_ease-in-out_infinite_0.4s]">
            .
          </span>
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-400">리포트를 생성하고 있습니다</p>
    </div>
  );
};

export default TabContents;
