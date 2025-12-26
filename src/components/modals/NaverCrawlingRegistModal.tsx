"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileSpreadsheet, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCrawlingRegist } from "@/apis/crawling";
import FileUploadZone from "@/components/common/FileUploadZone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NaverCrawlingRegistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z
  .object({
    title: z.string().min(1, "제목을 입력해주세요."),
    file: z
      .instanceof(File)
      .refine(
        (file: File) => {
          const validExtensions = [".xlsx", ".xls"];
          const fileExtension = file.name
            .substring(file.name.lastIndexOf("."))
            .toLowerCase();
          return validExtensions.includes(fileExtension);
        },
        { message: "Excel 파일(.xlsx, .xls)만 업로드 가능합니다." },
      )
      .nullable(),
    segment_num: z.string().min(1, "조건설정을 선택해주세요."),
    time_unit: z.string().min(1, "수집단위를 선택해주세요."),
    usage: z.string().min(1, "사용처를 선택해주세요."),
    start_date: z.string().min(1, "시작일을 선택해주세요."),
    advertiser: z.string().min(1, "광고주를 입력해주세요."),
    team: z.string().optional(),
    manager: z.string().optional(),
    content: z.string().min(1, "내용을 입력해주세요."),
  })
  .refine((data) => data.file !== null, {
    message: "엑셀 파일을 업로드해주세요.",
    path: ["file"],
  });

export type CrawlingRegistFormValues = z.infer<typeof formSchema>;

const NaverCrawlingRegistModal = ({
  open,
  onOpenChange,
}: NaverCrawlingRegistModalProps) => {
  const { mutateAsync: registCrawling } = useCrawlingRegist();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CrawlingRegistFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      segment_num: "0",
      time_unit: "month",
      usage: "0",
      title: "",
      file: null,
      start_date: "",
      advertiser: "",
      team: "",
      manager: "",
      content: "",
    },
  });

  const segment_num = watch("segment_num");
  const time_unit = watch("time_unit");
  const usage = watch("usage");

  const handleFileSelect = (files: File[]) => {
    const file = files[0];
    if (file) {
      setValue("file", file, { shouldValidate: true });
    }
  };

  const handleRemoveFile = () => {
    setValue("file", null, { shouldValidate: true });
  };

  const onSubmit = (data: CrawlingRegistFormValues) => {
    console.log("Form data:", data);
    registCrawling(data);
    // TODO: API 호출
    onOpenChange(false);
    reset();
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            수집내용 등록
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-4">
            {/* 제목 */}
            <div className="grid gap-2">
              <Label
                htmlFor="title"
                className="text-sm font-semibold text-slate-200"
                required
              >
                제목
              </Label>
              <Input
                id="title"
                isNagative
                {...register("title")}
                placeholder="제목을 입력하세요"
                className="w-full"
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* 엑셀업로드 */}
            <div className="grid gap-2">
              <Label className="text-sm font-semibold text-slate-200" required>
                엑셀업로드
              </Label>
              <FileUploadZone
                onFileSelect={handleFileSelect}
                accept=".xlsx,.xls"
                multiple={false}
                selectedFile={watch("file")}
                showDragDrop={true}
                variant="default"
                placeholder="파일을 클릭하거나 드래그앤드롭으로 업로드하세요."
                isNagative
              />
              {watch("file") && (
                <div className="mt-2 flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2">
                  <FileSpreadsheet className="h-4 w-4 shrink-0 text-green-500" />
                  <span className="flex-1 truncate text-sm text-slate-200">
                    {watch("file")?.name}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors"
                    aria-label="파일 삭제"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => {
                    // TODO: 샘플 파일 다운로드 구현
                    console.log("샘플 다운로드");
                  }}
                  className="text-sm text-primary hover:text-primary/80 underline"
                >
                  [샘플 다운로드]
                </button>
              </div>
              {errors.file && (
                <p className="text-xs text-red-500">{errors.file.message}</p>
              )}
            </div>

            {/* 조건설정 */}
            <div className="grid gap-2">
              <Label className="text-sm font-semibold text-slate-200" required>
                조건설정
              </Label>
              <div className="flex flex-row gap-6">
                {[
                  { label: "전체(최근 1년)", value: "0" },
                  { label: "전체 (기간 설정)", value: "1" },
                  { label: "광고시스템 연령대 별", value: "2" },
                  { label: "5세 단위 연령대 별", value: "3" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={String(option.value)}
                      checked={segment_num === option.value}
                      onChange={(e) => setValue("segment_num", e.target.value)}
                      className="w-4 h-4 text-primary border-slate-600 focus:ring-primary bg-slate-800"
                    />
                    <span className="text-xs text-slate-300 font-normal">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.segment_num && (
                <p className="text-xs text-red-500">
                  {errors.segment_num.message}
                </p>
              )}
            </div>

            {/* 수집단위 & 시작일 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label
                  required
                  className="text-sm font-semibold text-slate-200"
                >
                  수집단위
                </Label>
                <div className="flex gap-6">
                  {[
                    { label: "월별", value: "month" },
                    { label: "일별", value: "date" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={option.value}
                        checked={time_unit === option.value}
                        onChange={(e) => setValue("time_unit", e.target.value)}
                        className="w-4 h-4 text-primary border-slate-600 focus:ring-primary bg-slate-800"
                      />
                      <span className="text-sm text-slate-200">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.time_unit && (
                  <p className="text-xs text-red-500">
                    {errors.time_unit.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="start_date"
                  required
                  className="text-sm font-semibold text-slate-200"
                >
                  시작일
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  isNagative
                  {...register("start_date")}
                  className="w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-100"
                />
                {errors.start_date && (
                  <p className="text-xs text-red-500">
                    {errors.start_date.message}
                  </p>
                )}
              </div>
            </div>

            {/* 사용처 */}
            <div className="grid gap-2">
              <Label className="text-sm font-semibold text-slate-200" required>
                사용처
              </Label>
              <div className="flex flex-row gap-6">
                {[
                  { label: "경쟁PT", value: "0" },
                  { label: "캠페인(계열)", value: "1" },
                  { label: "캠페인(비계열)", value: "2" },
                  { label: "홍보/교육/연구", value: "3" },
                  { label: "기타", value: "4" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={String(option.value)}
                      checked={usage === option.value}
                      onChange={(e) => setValue("usage", e.target.value)}
                      className="w-4 h-4 text-primary border-slate-600 focus:ring-primary bg-slate-800"
                    />
                    <span className="text-xs text-slate-300 font-normal">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 광고주 */}
            <div className="grid gap-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="advertiser"
                    required
                    className="text-sm font-semibold text-slate-200"
                  >
                    광고주
                  </Label>
                  <Input
                    id="advertiser"
                    isNagative
                    {...register("advertiser")}
                    placeholder="광고주를 입력하세요"
                  />
                  {errors.advertiser && (
                    <p className="text-xs text-red-500">
                      {errors.advertiser.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="team"
                      className="text-sm font-semibold text-slate-200"
                    >
                      담당팀
                    </Label>
                    <Input
                      id="team"
                      isNagative
                      {...register("team")}
                      placeholder="담당팀을 입력하세요"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="manager"
                      className="text-sm font-semibold text-slate-200"
                    >
                      담당자
                    </Label>
                    <Input
                      id="manager"
                      isNagative
                      {...register("manager")}
                      placeholder="담당자를 입력하세요"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* 내용 */}
            <div className="grid gap-2">
              <Label
                htmlFor="content"
                required
                className="text-sm font-semibold text-slate-200"
              >
                내용
              </Label>
              <textarea
                id="content"
                {...register("content", { required: "내용을 입력해주세요." })}
                placeholder="내용을 입력하세요"
                rows={5}
                className="w-full resize-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.content && (
                <p className="text-xs text-red-500">{errors.content.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-slate-600 hover:text-slate-600"
              >
                닫기
              </Button>
            </DialogClose>
            <Button type="submit" className="text-white font-semibold">
              등록
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NaverCrawlingRegistModal;
