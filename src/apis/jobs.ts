import { useQuery } from "@tanstack/react-query";
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
