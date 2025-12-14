import { useAuthStore } from "@/stores/authStore";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { http } from "./common";

export interface SessionInfo {
  session_id: string;
  user_id: string;
  name?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  files?: SessionFile[];
  jobs?: AnalysisJob[];
}

export interface SessionFile {
  file_id: string;
  filename: string;
  size: number;
}

export interface AnalysisJob {
  job_id: string;
  task_type: string;
  status: string;
  created_at: string;
}

export const useUpsertSessionInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionInfo?: Pick<SessionInfo, "name" | "description">) => {
      const userId = useAuthStore.getState().id;

      return http.post("/api/sessions", { ...sessionInfo, user_id: userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
  });
};

export const useSessionInfoList = () => {
  const userId = useAuthStore.getState().id;
  return useSuspenseQuery<SessionInfo[]>({
    queryKey: ["/api/sessions", { user_id: userId }],
  });
};

export const useSessionInfo = (sessionId: string | null) => {
  return useQuery<SessionInfo>({
    queryKey: ["/api/sessions/:session_id", { session_id: sessionId }],
    enabled: !!sessionId,
  });
};

interface AnalysisJobsStartRequest {
  session_id?: string;
  file_ids?: string[];
  params: {
    task_type?: string;
    user_request?: string;
    preproc_requirements?: string;
    first_step: boolean;
    options?: Record<string, any>;
  };
  job_id?: string;
}

export interface AnalysisJobsStartResponse {
  job_id: string;
  status: string;
}

export const useAnalysisJobsStart = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AnalysisJobsStartResponse,
    Error,
    AnalysisJobsStartRequest
  >({
    mutationFn: ({
      session_id,
      file_ids,
      params,
    }: AnalysisJobsStartRequest) => {
      return http.post(`/api/analysis-jobs`, {
        session_id,
        file_ids,
        params,
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      queryClient.invalidateQueries({
        queryKey: [
          "/api/sessions/:session_id",
          { session_id: variables.session_id },
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/analysis-jobs/:job_id"],
      });
    },
  });
};
