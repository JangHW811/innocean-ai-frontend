import { useEffect, useMemo, useRef } from "react";
import { type ArtifactInfo, useJobInfo } from "@/apis/jobs";
import { type AnalysisJob, useSessionInfo } from "@/apis/sessions";
import { useSessionStore } from "@/stores/sessionStore";
import DeepAnalysisModal from "../modals/DeepAnalysisModal";
import { TabsContent } from "../ui/tabs";
import ArtifactContents from "./ArtifactContents";

interface TabSectionProps extends AnalysisJob {}

const TabContents = ({ job_id }: TabSectionProps) => {
  const { data: jobInfo } = useJobInfo(job_id);
  const { selectedSessionId } = useSessionStore();
  const { data: sessionInfo } = useSessionInfo(selectedSessionId);
  const job = sessionInfo?.jobs?.find((job) => job.job_id === job_id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isFailed, isRunning } = jobInfo || {};

  const contents = useMemo(() => {
    const artifacts =
      jobInfo?.steps?.flatMap((step) => {
        const userMessage = step.messages.find(
          (message) => message.role === "user",
        );

        return [
          ...step.artifacts,
          ...(userMessage
            ? [{ ...userMessage, artifact_id: `user-message-${step.step}` }]
            : []),
        ];
      }) ?? [];
    return artifacts;
  }, [jobInfo?.steps]);

  // 실제 artifact만 필터링하여 순차번호 계산
  const artifactSequenceMap = useMemo(() => {
    const map = new Map<string, number>();
    let sequence = 0;
    contents.forEach((item) => {
      if (!item.artifact_id.startsWith("user-message-")) {
        sequence++;
        map.set(item.artifact_id, sequence);
      }
    });
    return map;
  }, [contents]);

  console.log(contents);

  useEffect(() => {
    if (scrollContainerRef.current && contents.length > 0) {
      const container = scrollContainerRef.current;
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
                    aria-label="문서 아이콘"
                  >
                    <title>문서 아이콘</title>
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
                    {jobInfo.filenames.map((filename) => (
                      <span
                        key={filename}
                        className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        {filename}
                      </span>
                    ))}
                  </div>
                </div>
                {!!job?.first_step && (
                  <div className="shrink-0">
                    <DeepAnalysisModal />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <section className="space-y-6">
          {contents.map((artifact) => {
            return artifact.artifact_id.startsWith("user-message-") ? (
              <div
                key={artifact.artifact_id}
                className="my-8 flex items-center"
              >
                <div className="flex-1 h-px bg-slate-200"></div>
                <div className="px-4 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-400"></div>
                </div>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>
            ) : (
              <ArtifactContents
                key={artifact.artifact_id}
                {...(artifact as ArtifactInfo)}
                sequenceNumber={artifactSequenceMap.get(artifact.artifact_id)}
              />
            );
          })}
        </section>
        {isRunning ? (
          <TabContentsSkeleton />
        ) : (
          isFailed && <div className="text-red-500">분석 실패</div>
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
