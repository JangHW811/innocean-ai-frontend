"use client";

import { FileUp, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface FileUploadZoneProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  isUploading?: boolean;
  selectedFile?: File | null;
  showDragDrop?: boolean;
  buttonText?: string;
  placeholder?: string;
  className?: string;
  variant?: "default" | "compact";
  sampleDownloadLink?: React.ReactNode;
}

const FileUploadZone = ({
  onFileSelect,
  accept,
  multiple = false,
  isUploading = false,
  selectedFile,
  showDragDrop = true,
  buttonText = "파일 선택",
  placeholder,
  className = "",
  variant = "default",
  sampleDownloadLink,
}: FileUploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList?.length) return;
    onFileSelect(Array.from(fileList));
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (showDragDrop) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    e.preventDefault();
    if (showDragDrop) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!showDragDrop || !e.dataTransfer.files?.length) return;
    onFileSelect(Array.from(e.dataTransfer.files));
  };

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          className="border-slate-600 hover:bg-slate-800 text-slate-200"
          onClick={handleBrowse}
          disabled={isUploading}
        >
          <FileUp className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
        <span className="text-sm text-slate-400">
          {selectedFile ? selectedFile.name : "선택된 파일 없음"}
        </span>
        {sampleDownloadLink && (
          <div className="ml-auto">{sampleDownloadLink}</div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`w-full ${className}`}
      {...(showDragDrop
        ? {
            onDragOver: handleDragOver,
            onDragLeave: handleDragLeave,
            onDrop: handleDrop,
            onClick: handleBrowse,
            onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleBrowse();
              }
            },
            role: "button",
            tabIndex: 0,
            "aria-label": "파일 업로드 드롭 영역",
          }
        : {})}
    >
      <div
        className={`mt-3 rounded-2xl border-2 border-dashed py-10 text-center text-xs transition ${
          isUploading
            ? "border-primary bg-primary/10 text-primary"
            : isDragging
              ? "border-primary bg-primary/10 text-primary"
              : "border-slate-600 bg-slate-800/50 text-slate-400"
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-primary">파일 업로드 중...</span>
          </div>
        ) : (
          placeholder || "파일을 클릭하거나 드래그앤드롭으로 업로드하세요."
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUploadZone;
