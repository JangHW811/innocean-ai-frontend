import { useJobInfo } from "@/apis/jobs";
import { AnalysisJob } from "@/apis/sessions";
import { useEffect, useMemo, useRef } from "react";
import DeepAnalysisModal from "../modals/DeepAnalysisModal";
import { TabsContent } from "../ui/tabs";
import ArtifactContents from "./ArtifactContents";
interface TabSectionProps extends AnalysisJob {}

const TabContents = ({ job_id }: TabSectionProps) => {
  const { data: jobInfo } = useJobInfo(job_id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isFailed, isRunning } = jobInfo || {};

  const contents = useMemo(() => {
    const artifacts = jobInfo?.steps?.flatMap((step) => step.artifacts) ?? [];
    return artifacts;
  }, [jobInfo?.steps]);

  // contents가 변경될 때마다 스크롤을 최하단으로 이동
  useEffect(() => {
    if (scrollContainerRef.current && contents.length > 0) {
      const container = scrollContainerRef.current;
      // 약간의 지연을 두어 DOM 업데이트 후 스크롤
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }, 600);
    }
  }, [contents]);

  return (
    <TabsContent
      value={job_id}
      className="flex-1 flex flex-col min-h-0 overflow-hidden mt-6"
    >
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0">
        {jobInfo?.filenames && jobInfo.filenames.length > 0 && (
          <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 shadow-sm p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 text-indigo-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    분석에 사용된 데이터
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {jobInfo.filenames.map((filename, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        {filename}
                      </span>
                    ))}
                  </div>
                </div>
                {
                  <div className="shrink-0">
                    <DeepAnalysisModal />
                  </div>
                }
              </div>
            </div>
          </div>
        )}
        {contents.map((artifact) => (
          <ArtifactContents key={artifact.artifact_id} {...artifact} />
        ))}
        {isRunning ? (
          <TabContentsSkeleton />
        ) : (
          <>{isFailed && <div className="text-red-500">분석 실패</div>}</>
        )}
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
