import { useQuery } from "@tanstack/react-query";

export interface MethodsResponse {
  [key: string]: {
    label: string;
    items: {
      [key: string]: {
        label: string;
      };
    };
  };
}

export const useMethods = () => {
  return useQuery<MethodsResponse>({
    queryKey: ["/api/methods"],
  });
};
