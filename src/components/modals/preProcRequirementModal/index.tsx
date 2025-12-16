"use client";

import { NotebookPen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMethods } from "@/apis/method";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TagInput from "@/components/ui/tag-input";
import { useAlertActions } from "@/stores/alertStore";
import { useSessionStore } from "@/stores/sessionStore";

interface PreProcRequirementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormValues {
  brand_name?: string;
  competitive_brand_name?: string;
  preproc_requirements?: string;
}

const PreProcRequirementModal = ({
  open,
  onOpenChange,
}: PreProcRequirementModalProps) => {
  const [isComposing, setIsComposing] = useState(false);
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
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const { data: jobTypeCategories } = useMethods();

  const isSelectedBrandCompetitiveAnalysis = useMemo(() => {
    const brandCompetitiveAnalysisItems =
      jobTypeCategories?.["brand_competitive_analysis"]?.items;
    return !!brandCompetitiveAnalysisItems?.[selectedJobType!];
  }, [selectedJobType, jobTypeCategories]);

  const handleAnalysisStart = async ({
    brand_name,
    competitive_brand_name,
    preproc_requirements,
  }: FormValues) => {
    const alertMessage = preproc_requirements
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
            preproc_requirements: preproc_requirements,
            first_step: true,
            user_request: "",
            options: {
              brand_name: brand_name,
              competitive_brand_name: competitive_brand_name,
            },
          },
        });
        setSelectedJobType(null);
        setSelectedFileIdList([]);
        setSelectedJobId(job_id);
        onOpenChange(false);
      },
    });
  };

  console.log("errors", errors, watch("competitive_brand_name"));

  const renderBrandInputAres = () => {
    return (
      <>
        <div className="grid gap-2.5">
          <div className="flex items-center gap-2">
            <NotebookPen className="w-4 h-4 text-indigo-400" />
            <Label
              htmlFor="preprocRequirements"
              className="text-sm font-semibold text-slate-200"
            >
              분석대상 브랜드
            </Label>
          </div>
          <Input
            isNagative
            {...register("brand_name", {
              onChange(event) {
                // 조합 중이 아닐 때만 필터링
                if (!isComposing) {
                  const value = event.target.value;
                  // 한글, 영문, 숫자, 공백만 허용하고 특수문자 제거
                  const filteredValue = value.replace(
                    /[^가-힣a-zA-Z0-9\s]/g,
                    "",
                  );
                  if (value !== filteredValue) {
                    setValue("brand_name", filteredValue, {
                      shouldValidate: true,
                    });
                    event.target.value = filteredValue;
                  }
                }
              },
              required: "분석대상 브랜드를 입력해주세요",
            })}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={(event) => {
              setIsComposing(false);
              // 한글 입력 조합 완료 후 필터링
              const value = event.currentTarget.value;
              const filteredValue = value.replace(/[^가-힣a-zA-Z0-9\s]/g, "");
              if (value !== filteredValue) {
                setValue("brand_name", filteredValue, {
                  shouldValidate: true,
                });
                event.currentTarget.value = filteredValue;
              }
            }}
            placeholder="분석대상 브랜드를 입력해주세요(특수문자 제외)"
          />
          {errors.brand_name && (
            <p className="text-xs text-red-500">{errors.brand_name.message}</p>
          )}
        </div>
        <div className="grid gap-2.5">
          <div className="flex items-center gap-2">
            <NotebookPen className="w-4 h-4 text-indigo-400" />
            <Label
              htmlFor="preprocRequirements"
              className="text-sm font-semibold text-slate-200"
            >
              경쟁사 브랜드
            </Label>
          </div>
          <Controller
            control={control}
            name="competitive_brand_name"
            rules={{
              required: "경쟁사 브랜드를 입력해주세요",
            }}
            render={({ field }) => (
              <TagInput
                placeholder="경쟁사 브랜드를 입력해주세요(특수문자 제외)"
                isNagative
                {...field}
                onChange={(tags) => {
                  field.onChange(tags.join(","));
                }}
                value={field.value?.split(",") ?? []}
              />
            )}
          />
          {errors.competitive_brand_name && (
            <p className="text-xs text-red-500">
              {errors.competitive_brand_name.message}
            </p>
          )}
        </div>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700">
        <form onSubmit={handleSubmit(handleAnalysisStart)}>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-white">
              전처리 요구사항 입력{errors?.brand_name?.message}
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
                {...register("preproc_requirements")}
                placeholder="예: 결측치 처리 방법, 이상치 제거 기준, 데이터 정규화 방법 등을 명시해주세요."
                className="w-full resize-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500/20"
              />
              <p className="text-xs text-slate-500">
                분석 데이터의 전처리 방식을 구체적으로 설명해주세요. 입력하지
                않아도 진행 가능합니다.
              </p>
            </div>
            {isSelectedBrandCompetitiveAnalysis && renderBrandInputAres()}
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
              type="submit"
              loading={isPending}
              className="text-white font-semibold"
            >
              분석 시작
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PreProcRequirementModal;
