import { useSessionStore } from "@/stores/sessionStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "./common";

export interface JobInfoRequest {
  job_id: string;
  status: string;
  result: string;
}

export interface JobInfoResponse {
  job_id: string;
  status: string;
  steps: Step[];
  task_type: string;
  filenames: string[];
}

type Step = {
  step: number;
  step_name: string;
  status: string;
  messages: MessageInfo[];
  artifacts: ArtifactInfo[];
};
export interface MessageInfo {
  role: string;
  content: string;
  created_at: string;
}
export interface ArtifactInfo {
  artifact_id: string;
  type: "chart_image" | "table_csv" | "markdown_report";
  filename: string;
  url: string;
}

export interface JobInfoResponseWithStatus extends JobInfoResponse {
  isFailed: boolean;
  isRunning: boolean;
  isSuccess: boolean;
}

export const useJobInfo = (jobId?: string | null) => {
  const queryResult = useQuery<JobInfoResponseWithStatus>({
    queryKey: ["/api/analysis-jobs/:job_id", { job_id: jobId }],
    enabled: !!jobId,
    queryFn: async () => {
      const result = await http.get<JobInfoResponse>(
        `/api/analysis-jobs/${jobId}`
      );

      const isFailed = result?.status === "FAILED";
      const isRunning =
        result?.status === "RUNNING" || result?.status === "PENDING";
      const isSuccess = result?.status === "SUCCEEDED";

      return { ...result, isFailed, isRunning, isSuccess };
    },
    refetchInterval: (query) => {
      const data = query.state.data;
      const isRunning =
        data?.status === "RUNNING" || data?.status === "PENDING";
      return isRunning ? 5000 : false;
    },
  });

  return queryResult;
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  const { selectedSessionId } = useSessionStore();
  return useMutation<void, Error, string>({
    mutationFn: (jobId: string) => {
      return http.delete(`/api/analysis-jobs/${jobId}`);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      queryClient.invalidateQueries({
        queryKey: [
          "/api/sessions/:session_id",
          { session_id: selectedSessionId },
        ],
      });
    },
  });
};

interface JobCsvFilesResponse {
  job_id: string;
  csv_files: JobCsvFile[];
}

export interface JobCsvFile {
  artifact_id: string;
  file_id: string;
  filename: string;
  url: string;
}

export const useJobCsvFiles = (jobId: string) => {
  return useQuery<JobCsvFilesResponse>({
    queryKey: ["/api/analysis-jobs/:job_id/csv-files", { job_id: jobId }],
    enabled: !!jobId,
  });
};
