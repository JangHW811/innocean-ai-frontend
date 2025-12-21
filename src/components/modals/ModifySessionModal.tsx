"use client";

import { useSessionInfo, useUpdateSession } from "@/apis/sessions";
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
import { FileText, Target } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const ModifySessionModal = ({
  session_id,
  open,
  onClose,
}: {
  session_id: string;
  open: boolean;
  onClose: () => void;
}) => {
  const { mutateAsync: upsertSessionInfo } = useUpdateSession(session_id);
  const { data: sessionInfo, isSuccess } = useSessionInfo(session_id);
  const { name, description } = sessionInfo ?? {};
  const methods = useForm();
  const { register, handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    if (isSuccess) {
      setValue("name", name);
      setValue("description", description);
    }
  }, [isSuccess, name, description]);

  console.log("sessionInfo", sessionInfo);

  const onSubmit = async (data: any) => {
    await upsertSessionInfo({
      name: data.name,
      description: data.description,
    });
    onClose();
  };

  const onError = (errors: any) => {
    console.log("onerror", errors);
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700">
        <form className="w-full" onSubmit={handleSubmit(onSubmit, onError)}>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-white">
              세션 정보 수정
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm">
              세션의 정보를 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-2.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-slate-200"
                >
                  프로젝트 개요
                </Label>
              </div>
              <Input
                id="name"
                placeholder="예: 2024년 전기차 시장 트렌드 분석"
                isNagative
                {...register("name")}
              />
              <p className="text-xs text-slate-500 ml-6">
                분석하고자 하는 프로젝트의 전반적인 내용을 간단히 설명해주세요.
              </p>
            </div>

            <div className="grid gap-2.5">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <Label
                  htmlFor="description"
                  className="text-sm font-semibold text-slate-200"
                >
                  분석 목표
                </Label>
              </div>
              <Input
                id="description"
                placeholder="예: 브랜드별 선호도 및 구매 의도 파악"
                isNagative
                {...register("description")}
              />
              <p className="text-xs text-slate-500 ml-6">
                이 분석을 통해 달성하고자 하는 구체적인 목표를 명시해주세요.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-slate-600 hover:text-slate-600"
              >
                취소
              </Button>
            </DialogClose>
            <Button type="submit" className="text-white font-semibold">
              저장
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModifySessionModal;
