"use client";

import { NotebookPen, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Input } from "../ui/input";

interface PreProcRequirementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const INSIGHT_CATEGORY_LIST = [
  "category_brand_trend",
  "category_needs_triggers",
  "category_unmet_barriers",
  "category_kbf",
  "category_usage_moment",
  "lifestyle_analysis",
  "brand_preference_factors",
  "brand_needs_triggers",
  "brand_unmet_barriers",
  "brand_kbf",
  "brand_usage_moment",
  "brand_image",
];

interface FormValues {
  brand_name?: string;
  competitive_brands: string[];
  preproc_requirements?: string;
  insight_count: number;
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
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      competitive_brands: [""],
    },
  });

  const { fields, append, remove } = useFieldArray<any>({
    control,
    name: "competitive_brands",
  });

  console.log("fields", fields);

  useEffect(() => {
    if (!open) {
      reset({
        competitive_brands: [""],
      });
    }
  }, [open, reset]);

  const isSelectedInsightCategory = useMemo(() => {
    return selectedJobType
      ? INSIGHT_CATEGORY_LIST.includes(selectedJobType)
      : false;
  }, [selectedJobType]);

  const handleAnalysisStart = async ({
    brand_name,
    competitive_brands,
    preproc_requirements,
    insight_count,
  }: FormValues) => {
    const fileField = {
      file_id:
        selectedFileIdList?.length === 1 ? selectedFileIdList[0] : undefined,
      file_ids: selectedFileIdList?.length > 0 ? selectedFileIdList : [],
    };
    const filteredCompetitiveBrands = competitive_brands.filter(
      (brand) => brand.trim() !== "",
    );
    const alertMessage = preproc_requirements
      ? `분석을 시작하시겠습니까?`
      : `전처리 요구사항 없이 분석을 시작하시겠습니까?`;
    confirm({
      title: "분석 시작",
      description: alertMessage,
      onConfirm: async () => {
        const { job_id } = await startAnalysisJob({
          session_id: selectedSessionId!,
          ...fileField,
          params: {
            task_type: selectedJobType!,
            preproc_requirements: preproc_requirements,
            first_step: true,
            user_request: "",
            target_brand: brand_name ? [brand_name] : [],
            competitor_brand:
              filteredCompetitiveBrands.length > 0
                ? filteredCompetitiveBrands
                : [],
            analysis_target: "",
            preprocessing_requirements: preproc_requirements,
            insight_count,
          },
        });
        setSelectedJobType(null);
        setSelectedFileIdList([]);
        setSelectedJobId(job_id);
        onOpenChange(false);
      },
    });
  };

  console.log(
    "isSelectedInsightCategory",
    isSelectedInsightCategory,
    selectedJobType,
  );

  const renderBrandInputAres = () => {
    return (
      <>
        {isSelectedInsightCategory && (
          <div className="grid gap-2.5">
            <div className="flex items-center gap-2">
              <NotebookPen className="w-4 h-4 text-indigo-400" />
              <Label
                htmlFor="insightCount"
                className="text-sm font-semibold text-slate-200"
              >
                인사이트 갯수
              </Label>
            </div>
            <Input
              isNagative
              type="number"
              max={20}
              id="insightCount"
              {...register("insight_count", {
                valueAsNumber: true,
                required: "인사이트 갯수를 입력해주세요",
                max: {
                  value: 20,
                  message: "인사이트 갯수는 20 이하여야 합니다.",
                },
                onChange: (e) => {
                  const value = e.target.value;
                  if (value === "") {
                    return;
                  }
                  const numValue = Number(value);
                  if (!Number.isNaN(numValue)) {
                    if (numValue > 20) {
                      e.target.value = "20";
                      setValue("insight_count", 20, { shouldValidate: true });
                    } else if (numValue < 1) {
                      e.target.value = "1";
                      setValue("insight_count", 1, { shouldValidate: true });
                    }
                  }
                },
              })}
              placeholder="인사이트 갯수를 입력해주세요"
            />
            {errors.insight_count && (
              <p className="text-xs text-red-500">
                {errors.insight_count.message}
              </p>
            )}
          </div>
        )}
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <NotebookPen className="w-4 h-4 text-indigo-400" />
              <Label
                htmlFor="preprocRequirements"
                className="text-sm font-semibold text-slate-200"
              >
                경쟁사 브랜드
              </Label>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-slate-800 border-slate-600 hover:bg-slate-700"
              onClick={() => {
                append("");
              }}
            >
              <Plus className="h-4 w-4 text-slate-200" />
            </Button>
          </div>
          <div className="space-y-2">
            {fields.map((field: { id: string }, index: number) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  isNagative
                  {...register(`competitive_brands.${index}` as const)}
                  onChange={(event) => {
                    // 조합 중이 아닐 때만 필터링
                    if (!isComposing) {
                      const value = event.target.value;
                      // 한글, 영문, 숫자, 공백만 허용하고 특수문자 제거
                      const filteredValue = value.replace(
                        /[^가-힣a-zA-Z0-9\s]/g,
                        "",
                      );
                      if (value !== filteredValue) {
                        setValue(
                          `competitive_brands.${index}` as const,
                          filteredValue,
                          { shouldValidate: true },
                        );
                      }
                    }
                  }}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={(event) => {
                    setIsComposing(false);
                    // 한글 입력 조합 완료 후 필터링
                    const value = event.currentTarget.value;
                    const filteredValue = value.replace(
                      /[^가-힣a-zA-Z0-9\s]/g,
                      "",
                    );
                    if (value !== filteredValue) {
                      setValue(
                        `competitive_brands.${index}` as const,
                        filteredValue,
                        { shouldValidate: true },
                      );
                    }
                  }}
                  placeholder="경쟁사 브랜드를 입력해주세요(특수문자 제외)"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-700"
                  onClick={() => {
                    if (fields.length > 1) {
                      remove(index);
                    }
                  }}
                  disabled={fields.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
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
                className="w-full resize-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-500">
                분석 데이터의 전처리 방식을 구체적으로 설명해주세요. 입력하지
                않아도 진행 가능합니다.
              </p>
            </div>
            {renderBrandInputAres()}
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
