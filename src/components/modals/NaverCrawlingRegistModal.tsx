"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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

interface FormValues {
  title: string;
  excelFile: File | null;
  condition: string;
  collectionUnit: string;
  usage: string;
  advertiser: string;
  responsibleTeam: string;
  responsiblePerson: string;
  content: string;
}

const NaverCrawlingRegistModal = ({
  open,
  onOpenChange,
}: NaverCrawlingRegistModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      condition: "전체(최근1년)",
      collectionUnit: "Month",
      usage: "경쟁PT",
    },
  });

  // 파일 validation
  register("excelFile", {
    required: "엑셀 파일을 업로드해주세요.",
    validate: (value) => {
      if (!value) return "엑셀 파일을 업로드해주세요.";
      return true;
    },
  });

  const condition = watch("condition");
  const collectionUnit = watch("collectionUnit");
  const usage = watch("usage");

  const handleFileSelect = (files: File[]) => {
    const file = files[0];
    if (file) {
      // Excel 파일만 허용
      const validExtensions = [".xlsx", ".xls"];
      const fileExtension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        alert("Excel 파일(.xlsx, .xls)만 업로드 가능합니다.");
        return;
      }
      setSelectedFile(file);
      setValue("excelFile", file, { shouldValidate: true });
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    // TODO: API 호출
    onOpenChange(false);
    reset();
    setSelectedFile(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
    setSelectedFile(null);
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
              >
                제목 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                isNagative
                {...register("title", { required: "제목을 입력해주세요." })}
                placeholder="제목을 입력하세요"
                className="w-full"
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* 엑셀업로드 */}
            <div className="grid gap-2">
              <Label className="text-sm font-semibold text-slate-200">
                엑셀업로드 <span className="text-red-500">*</span>
              </Label>
              <FileUploadZone
                onFileSelect={handleFileSelect}
                accept=".xlsx,.xls"
                multiple={false}
                selectedFile={selectedFile}
                showDragDrop={true}
                variant="default"
                placeholder="파일을 클릭하거나 드래그앤드롭으로 업로드하세요."
                isNagative
              />
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
              {errors.excelFile && (
                <p className="text-xs text-red-500">
                  {errors.excelFile.message}
                </p>
              )}
            </div>

            {/* 조건설정 */}
            <div className="grid gap-2">
              <Label className="text-sm font-semibold text-slate-200">
                조건설정 <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-row gap-6">
                {[
                  "전체(최근1년)",
                  "전체(기간설정)",
                  "광고시스템 연령대 별",
                  "5세 단위 연령대 별 (2016-01-01 이후부터 가능)",
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={option}
                      checked={condition === option}
                      onChange={(e) => setValue("condition", e.target.value)}
                      className="w-4 h-4 text-primary border-slate-600 focus:ring-primary bg-slate-800"
                    />
                    <span className="text-sm text-slate-200">{option}</span>
                  </label>
                ))}
              </div>
              {errors.condition && (
                <p className="text-xs text-red-500">
                  {errors.condition.message}
                </p>
              )}
            </div>

            {/* 수집단위 */}
            <div className="grid gap-2">
              <Label className="text-sm font-semibold text-slate-200">
                수집단위 <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-6">
                {["Month", "Date"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={option}
                      checked={collectionUnit === option}
                      onChange={(e) =>
                        setValue("collectionUnit", e.target.value)
                      }
                      className="w-4 h-4 text-primary border-slate-600 focus:ring-primary bg-slate-800"
                    />
                    <span className="text-sm text-slate-200">{option}</span>
                  </label>
                ))}
              </div>
              {errors.collectionUnit && (
                <p className="text-xs text-red-500">
                  {errors.collectionUnit.message}
                </p>
              )}
            </div>

            {/* 사용처 */}
            <div className="grid gap-2">
              <Label className="text-sm font-semibold text-slate-200">
                사용처
              </Label>
              <div className="flex flex-row gap-6">
                {[
                  "경쟁PT",
                  "캠페인(계열)",
                  "캠페인(비계열)",
                  "홍보/교육/연구",
                  "기타",
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={option}
                      checked={usage === option}
                      onChange={(e) => setValue("usage", e.target.value)}
                      className="w-4 h-4 text-primary border-slate-600 focus:ring-primary bg-slate-800"
                    />
                    <span className="text-sm text-slate-200">{option}</span>
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="responsibleTeam"
                      className="text-sm font-semibold text-slate-200"
                    >
                      담당팀
                    </Label>
                    <Input
                      id="responsibleTeam"
                      isNagative
                      {...register("responsibleTeam")}
                      placeholder="담당팀을 입력하세요"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="responsiblePerson"
                      className="text-sm font-semibold text-slate-200"
                    >
                      담당자
                    </Label>
                    <Input
                      id="responsiblePerson"
                      isNagative
                      {...register("responsiblePerson")}
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
                className="text-sm font-semibold text-slate-200"
              >
                내용 <span className="text-red-500">*</span>
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
