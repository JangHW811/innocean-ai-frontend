import { type SessionInfo, useSessionStore } from "@/stores/sessionStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUpsertSessionInfo = () => {
  const queryClient = useQueryClient();
  const { addSessionInfo } = useSessionStore();
  return useMutation({
    mutationFn: (sessionInfo?: SessionInfo) => {
      return Promise.resolve(addSessionInfo(sessionInfo));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useSessionInfoList"] });
    },
  });
};

export const useSessionInfoList = () => {
  const { sessionInfoList } = useSessionStore();
  return useQuery({
    queryKey: ["/api/sessions"],
    queryFn: () => {
      return sessionInfoList;
    },
  });
};

export const useSessionInfo = (id: string) => {
  const { sessionInfoList } = useSessionStore();
  return useQuery({
    queryKey: ["useSessionInfo", id],
    queryFn: () => {
      return sessionInfoList.find((session) => session.id === id);
    },
  });
};
