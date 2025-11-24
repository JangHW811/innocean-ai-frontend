"use client";

import { FileText, Target } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAlert } from "../common/providers/AlertProvider";

const CreateSessionModal = () => {
  const [open, setOpen] = useState(false);
  const { confirm } = useAlert();
  const methods = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const onSubmit = (data: any) => {
    console.log("onsubmit", data);
    const values = Object.values(data);
    const isEmpty = values.every((value) => !value);
    console.log("isEmpty", isEmpty);
    if (isEmpty) {
      confirm({
        title: "컨텍스트 입력 안내",
        description: "컨텍스트 없이 분석을 진행 하시겠습니까?",
        onConfirm: () => {
          console.log("onConfirm");
          setOpen(false);
        },
      });
      return;
    }
    setOpen(false);
  };
  const onError = (errors: any) => {
    console.log("onerror", errors);
  };

  console.log("???", errors);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="mt-2 w-full text-white font-bold">
          + 세션 만들기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700">
        <form className="w-full" onSubmit={handleSubmit(onSubmit, onError)}>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-white">
              새 분석 세션 만들기
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm">
              분석할 프로젝트 정보를 입력하여 새로운 세션을 시작하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-2.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <Label
                  htmlFor="projectSummary"
                  className="text-sm font-semibold text-slate-200"
                >
                  프로젝트 개요
                </Label>
              </div>
              <Input
                id="projectSummary"
                placeholder="예: 2024년 전기차 시장 트렌드 분석"
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                {...register("projectSummary")}
              />
              <p className="text-xs text-slate-500 ml-6">
                분석하고자 하는 프로젝트의 전반적인 내용을 간단히 설명해주세요.
              </p>
            </div>

            <div className="grid gap-2.5">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <Label
                  htmlFor="analyticTarget"
                  className="text-sm font-semibold text-slate-200"
                >
                  분석 목표
                </Label>
              </div>
              <Input
                id="analyticTarget"
                placeholder="예: 브랜드별 선호도 및 구매 의도 파악"
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                {...register("analyticTarget")}
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
              세션 생성하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionModal;
