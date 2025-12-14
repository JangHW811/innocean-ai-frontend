"use client";

import { useJobCsvFiles, useJobInfo } from "@/apis/jobs";
import { useAnalysisJobsStart } from "@/apis/sessions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useSessionStore } from "@/stores/sessionStore";
import { List, Pencil, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import AnalysisTree from "../common/AnalysisTree";
import { Input } from "../ui/input";

interface FormValues {
  task_type: string;
  file_ids: string[];
  user_request: string;
}

const DeepAnalysisModal = () => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      task_type: "",
      user_request: "",
      file_ids: [],
    },
  });

  const { mutateAsync: startAnalysisJob, isPending } = useAnalysisJobsStart();

  const { selectedJobId, selectedSessionId, setSelectedJobId } =
    useSessionStore();
  const { data: jobInfo } = useJobInfo(selectedJobId);

  const { isRunning } = jobInfo ?? {};

  const { data } = useJobCsvFiles(selectedJobId!);

  const csvFiles = useMemo(() => {
    return data?.csv_files ?? [];
  }, [data]);

  useEffect(() => reset, [open, reset]);
  const onSubmit = async (data: FormValues) => {
    const { job_id } = await startAnalysisJob({
      session_id: selectedSessionId!,
      file_ids: Array.from(data.file_ids),
      params: {
        task_type: data.task_type,
        first_step: false,
        user_request: data.user_request,
        options: {},
      },
    });
    toast.success("심화분석이 시작되었습니다.");
    setSelectedJobId(job_id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          loading={isRunning}
          type="button"
          className="mt-2 w-full text-white font-bold"
        >
          심화분석
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-bold text-white">
            심화분석
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2.5">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-indigo-400" />
                <Label className="text-sm font-semibold text-slate-200">
                  선택 한 원문
                </Label>
              </div>
              <Controller
                control={control}
                name="file_ids"
                rules={{
                  required: "원문을 선택해주세요.",
                }}
                render={({ field }) => (
                  <section className="space-y-2 overflow-y-auto max-h-100">
                    {csvFiles.map((csvFile) => {
                      return (
                        <label
                          key={csvFile.file_id}
                          className="flex items-center gap-3 text-slate-200 text-sm bg-slate-800/50 p-3 rounded-lg border border-slate-700 hover:bg-slate-800/70 hover:border-slate-600 transition-all cursor-pointer"
                        >
                          <Checkbox
                            id={`file-${csvFile.file_id}`}
                            checked={field.value.includes(csvFile.file_id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.value.push(csvFile.file_id);
                              } else {
                                field.value = field.value.filter(
                                  (id) => id !== csvFile.file_id
                                );
                              }
                              field.onChange(field.value);
                            }}
                            className="shrink-0"
                          />
                          {csvFile.filename}
                        </label>
                      );
                    })}
                    {errors.file_ids && (
                      <p className="text-sm text-red-500">
                        {errors.file_ids.message}
                      </p>
                    )}
                  </section>
                )}
              />
            </div>

            <div className="grid gap-2.5">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <Label className="text-sm font-semibold text-slate-200">
                  분석기법 선택
                </Label>
              </div>
              <Controller
                control={control}
                name="task_type"
                rules={{
                  required: "분석기법을 선택해주세요.",
                }}
                render={({ field }) => (
                  <AnalysisTree
                    onSelectAnalysis={field.onChange}
                    theme="dark"
                    selectedAnalysisId={field.value}
                  />
                )}
              />
              {errors.task_type && (
                <p className="text-sm text-red-500">
                  {errors.task_type.message}
                </p>
              )}
            </div>
            <div className="grid gap-2.5">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-indigo-400" />
                <Label className="text-sm font-semibold text-slate-200">
                  프롬프트 입력
                </Label>
              </div>
              <Input isNagative {...register("user_request")} />
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
              loading={isPending}
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
