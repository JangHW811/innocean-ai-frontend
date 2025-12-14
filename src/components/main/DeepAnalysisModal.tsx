"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { List, Pencil, Target, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";

const DeepAnalysisModal = () => {
  const [open, setOpen] = useState(false);
  const methods = useForm();
  const { register, handleSubmit, reset } = methods;
  const onSubmit = async (data: any) => {};
  const onError = (errors: any) => {
    console.log("onerror", errors);
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="mt-2 w-full text-white font-bold">
          심화분석
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700">
        <form className="w-full" onSubmit={handleSubmit(onSubmit, onError)}>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-white">
              심화분석
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-2.5">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-indigo-400" />
                <Label className="text-sm font-semibold text-slate-200">
                  선택 한 원문
                </Label>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center justify-between text-slate-200 text-sm bg-slate-800/50 p-2 rounded border border-slate-700">
                  <span>수분 공급에 대한 니즈가 최다. [관련 원문 53건]</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </li>
                <li className="flex items-center justify-between text-slate-200 text-sm bg-slate-800/50 p-2 rounded border border-slate-700">
                  <span>가격보다는 성분(EWG) 중시 경향. [관련원문 23건]</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </li>
              </ul>
            </div>

            <div className="grid gap-2.5">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <Label className="text-sm font-semibold text-slate-200">
                  분석기법 선택
                </Label>
              </div>
              <Select
                onValueChange={(value) =>
                  methods.setValue("analysis_method", value)
                }
                defaultValue="emerging_signal"
              >
                <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white focus:ring-indigo-500">
                  <SelectValue placeholder="분석 기법을 선택해주세요" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  <SelectItem value="emerging_signal">
                    Emerging Signal
                  </SelectItem>
                  <SelectItem value="deep_dive">Deep Dive Analysis</SelectItem>
                  <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2.5">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-indigo-400" />
                <Label className="text-sm font-semibold text-slate-200">
                  프롬프트 입력
                </Label>
              </div>
              <Input id="description" isNagative {...register("description")} />
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
            <Button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6"
            >
              분석
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeepAnalysisModal;
