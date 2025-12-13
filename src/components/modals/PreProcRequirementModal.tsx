"use client";

import { useAnalysisJobsStart } from "@/apis/sessions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAlertActions } from "@/stores/alertStore";
import { useSessionStore } from "@/stores/sessionStore";
import { NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";

interface PreProcRequirementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PreProcRequirementModal = ({
  open,
  onOpenChange,
}: PreProcRequirementModalProps) => {
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

  useEffect(() => {
    if (!open) {
      setPreprocRequirements("");
    }
  }, [open]);

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
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-bold text-white">
            전처리 요구사항 입력
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm">
            분석을 시작하기 전에 필요한 전처리 요구사항을 입력해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2.5">
            <div className="flex items-center gap-2">
              <NotebookPen className="w-4 h-4 text-indigo-400" />
              <Label
                htmlFor="preprocRequirements"
                className="text-sm font-semibold text-slate-200"
              >
                전처리 요구사항
              </Label>
            </div>
            <textarea
              id="preprocRequirements"
              rows={5}
              value={preprocRequirements}
              onChange={(event) => setPreprocRequirements(event.target.value)}
              placeholder="예: 결측치 처리 방법, 이상치 제거 기준, 데이터 정규화 방법 등을 명시해주세요."
              className="w-full resize-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <p className="text-xs text-slate-500">
              분석 데이터의 전처리 방식을 구체적으로 설명해주세요. 입력하지
              않아도 진행 가능합니다.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="border-slate-600 hover:text-slate-600"
              disabled={isPending}
            >
              취소
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleAnalysisStart}
            loading={isPending}
            className="text-white font-semibold"
          >
            분석 시작
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreProcRequirementModal;
