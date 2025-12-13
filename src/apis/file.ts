import { useSessionStore } from "@/stores/sessionStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "./common";

export interface FileUploadParams {
  file: File;
  sessionId: string | null;
}
export interface FileUploadResponse {
  file_id: string;
  filename: string;
  size: number;
}
const useFileUpload = () => {
  const queryClient = useQueryClient();
  const { selectedSessionId } = useSessionStore();
  return useMutation<FileUploadResponse, Error, FileUploadParams>({
    mutationFn: async ({ file, sessionId }: FileUploadParams) => {
      if (!sessionId) {
        throw new Error("sessionId is required");
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("session_id", sessionId);
      return await http.multipart("/api/files", formData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [
          "/api/sessions/:session_id",
          { session_id: selectedSessionId },
        ],
      });
    },
  });
};

interface FileDownloadRequest {
  filename: string;
  session_id: string;
}

export const useFileDownload = () => {
  return useMutation<string, Error, FileDownloadRequest>({
    mutationFn: async ({ filename, session_id }: FileDownloadRequest) => {
      return await http.get(`/api/workspace/${session_id}/${filename}`);
    },
  });
};
export default useFileUpload;
