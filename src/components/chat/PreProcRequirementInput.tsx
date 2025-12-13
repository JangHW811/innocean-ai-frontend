import { useAnalysisJobsStart } from "@/apis/sessions";
import { useAlertActions } from "@/stores/alertStore";
import { useSessionStore } from "@/stores/sessionStore";
import { useState } from "react";
import { Button } from "../ui/button";

const ChatInput = () => {
  const [preprocRequirements, setPreprocRequirements] = useState("");
  const { confirm } = useAlertActions();
  const {
    selectedSessionId,
    selectedJobType,
    selectedFileIdList,
    setSelectedJobType,
    setSelectedFileIdList,
    setSelectedJobId,
  } = useSessionStore();
  const { mutateAsync: startAnalysisJob, isPending } = useAnalysisJobsStart();
  const handleAnalysisStart = async () => {
    const alertMessage = preprocRequirements
      ? `분석을 시작하시겠습니까?`
      : `전처리 요구사항 없이 분석을 시작하시겠습니까?`;
    confirm({
      title: "분석 시작",
      description: alertMessage,
      onConfirm: async () => {
        const { job_id } = await startAnalysisJob({
          session_id: selectedSessionId!,
          file_ids: selectedFileIdList ?? [],
          params: {
            task_type: selectedJobType!,
            preproc_requirements: preprocRequirements,
            first_step: true,
            user_request: "",
            options: {},
          },
        });
        setSelectedJobType(null);
        setSelectedFileIdList([]);
        setSelectedJobId(job_id);
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
        />
      </div>
      <div className="mt-3 flex items-center justify-end text-xs text-slate-400">
        <Button
          onClick={handleAnalysisStart}
          type="button"
          loading={isPending}
          className="rounded-full px-4 py-1.5 text-xs font-semibold text-white"
        >
          분석 시작
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
