import { useAnalysisJobsStart, useSessionInfo } from "@/apis/sessions";
import { useSessionStore } from "@/stores/sessionStore";
import { useState } from "react";
import { Button } from "../ui/button";

const ChatInput = () => {
  const [preprocRequirements, setPreprocRequirements] = useState("");
  const { selectedSessionId, selectedFileIdList, setSelectedJobType } =
    useSessionStore();
  const { data: sessionInfo } = useSessionInfo(selectedSessionId);
  const { mutateAsync: startAnalysisJob } = useAnalysisJobsStart();
  const handleAnalysisStart = () => {
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

  return (
    <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/90 shadow-lg backdrop-blur px-6 py-5">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
        <span>전처리 요구사항 입력</span>
      </div>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
        <textarea
          rows={3}
          value={preprocRequirements}
          onChange={(event) => setPreprocRequirements(event.target.value)}
          placeholder="분석전처리 요구사항을 입력해주세요."
          className="w-full resize-none border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleAnalysisStart();
            }
          }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>Shift + Enter = 줄바꿈</span>
        <Button
          onClick={handleAnalysisStart}
          type="button"
          className="rounded-full px-4 py-1.5 text-xs font-semibold text-white"
        >
          분석 시작
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
