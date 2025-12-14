"use client";
import useFileUpload from "@/apis/file";
import { useSessionInfo } from "@/apis/sessions";
import { useSessionStore } from "@/stores/sessionStore";
import { Loader2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import UploadedFileItem from "./UploadedFileItem";

const DataUpload = () => {
  const { mutateAsync, isPending: isUploading } = useFileUpload();
  const {
    selectedSessionId,
    selectedFileIdList,
    removeSelectedFileId,
    addSelectedFileId,
  } = useSessionStore();
  const { data: sessionInfo } = useSessionInfo(selectedSessionId);

  const uploadedFileList = useMemo(() => {
    return sessionInfo?.files?.filter((file) => file.source === "upload") || [];
  }, [sessionInfo?.files]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = async (incomingFiles: File[]) => {
    if (!incomingFiles.length) return;
    for (const file of incomingFiles) {
      try {
        await mutateAsync({
          file,
          sessionId: selectedSessionId,
        });
      } catch (error) {
        console.error("파일 업로드 실패", error);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList?.length) return;
    await handleFiles(Array.from(fileList));
    e.target.value = "";
  };

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer.files?.length) return;
    await handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleSelectFile = (fileId: string) => {
    if (selectedFileIdList.includes(fileId)) {
      if (selectedFileIdList.length === 1) {
        return;
      }
      removeSelectedFileId(fileId);
    } else {
      addSelectedFileId(fileId);
    }
  };

  return (
    <>
      <p className="text-left p-4 pb-2 sticky bg-white top-0 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        Uploaded Files
      </p>
      <div className="p-4 pt-0">
        <ul className="mt-3 space-y-2">
          {uploadedFileList.map((file) => (
            <UploadedFileItem
              key={file.file_id}
              file={{
                fileId: file.file_id,
                name: file.filename,
                size: file.size,
              }}
              handleSelectFile={handleSelectFile}
            />
          ))}
        </ul>
        <div
          className="w-full"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowse}
          role="region"
          aria-label="파일 업로드 드롭 영역"
        >
          <div
            className={`mt-3 rounded-2xl border-2 border-dashed py-10 text-center text-xs transition ${
              isUploading
                ? "border-indigo-400 bg-indigo-50/70 text-indigo-500"
                : isDragging
                ? "border-indigo-400 bg-indigo-50/70 text-indigo-500"
                : "border-slate-300 text-slate-400"
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                <span className="text-indigo-500">파일 업로드 중...</span>
              </div>
            ) : (
              "파일을 클릭하거나 드래그앤드롭으로 업로드하세요."
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </>
  );
};

export default DataUpload;
