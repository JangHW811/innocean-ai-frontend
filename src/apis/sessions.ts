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

export const useSessionInfo = (sessionId?: string | null) => {
  return useQuery<SessionInfo>({
    queryKey: ["/api/sessions/:session_id", { session_id: sessionId }],
    enabled: !!sessionId,
  });
};
