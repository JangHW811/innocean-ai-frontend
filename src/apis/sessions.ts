import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { http } from "./common";

export interface SessionInfo {
  session_id: string;
  user_id: string;
  name?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  file_ids?: string[];
  job_ids?: string[];
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

interface AnalysisJobsStartParams {
  session_id: string;
  file_id: string[] | string;
  params: {
    task_type: string;
    options: Record<string, any>;
  };
}

export interface AnalysisJobsStartResponse {
  job_id: string;
  status: string;
}

export const useAnalysisJobsStart = () => {
  const queryClient = useQueryClient();
  return useMutation<AnalysisJobsStartResponse, Error, AnalysisJobsStartParams>(
    {
      mutationFn: ({
        session_id,
        file_id,
        params,
      }: AnalysisJobsStartParams) => {
        return http.post(`/api/analysis-jobs`, { session_id, file_id, params });
      },
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
        queryClient.invalidateQueries({
          queryKey: [
            "/api/sessions/:session_id",
            { session_id: variables.session_id },
          ],
        });
      },
    },
  );
};

export interface JobInfoRequest {
  job_id: string;
  status: string;
  result: string;
}

export const useJobInfo = (jobId?: string | null) => {
  const queryResult = useQuery({
    queryKey: ["/api/analysis-jobs/:job_id", { job_id: jobId }],
    enabled: !!jobId,
  });

  const { isSuccess } = queryResult;
  if (isSuccess) {
  }

  console.log(queryResult);

  return queryResult;
};
