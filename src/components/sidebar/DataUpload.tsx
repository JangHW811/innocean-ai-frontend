"use client";
import { useMemo } from "react";
import useFileUpload from "@/apis/file";
import { useSessionInfo } from "@/apis/sessions";
import FileUploadZone from "@/components/common/FileUploadZone";
import { useSessionStore } from "@/stores/sessionStore";
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
        <FileUploadZone
          onFileSelect={handleFiles}
          multiple
          isUploading={isUploading}
          showDragDrop
        />
      </div>
    </>
  );
};

export default DataUpload;
