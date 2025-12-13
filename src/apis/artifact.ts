import { useQuery } from "@tanstack/react-query";
import { http } from "./common";

export const useArtifact = (artifact_id: string) => {
  return useQuery<string>({
    queryKey: ["/api/artifacts/:artifact_id", { artifact_id }],
    queryFn: async () => {
      const result = await http.getText(`/api/artifacts/${artifact_id}`);
      return result;
    },
  });
};
