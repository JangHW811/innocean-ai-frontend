import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type SessionInfo,
  useTempSessionStore,
} from "@/stores/tempSessionStore";

export const useUpsertSessionInfo = () => {
  const queryClient = useQueryClient();
  const { addTempSessionInfo } = useTempSessionStore();
  return useMutation({
    mutationFn: (sessionInfo?: SessionInfo) => {
      return Promise.resolve(addTempSessionInfo(sessionInfo));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useSessionInfoList"] });
    },
  });
};

export const useSessionInfoList = () => {
  const { tempSessionInfoList } = useTempSessionStore();
  return useQuery({
    queryKey: ["useSessionInfoList"],
    queryFn: () => {
      return tempSessionInfoList;
    },
  });
};
