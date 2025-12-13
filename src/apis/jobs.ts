import { useQuery } from "@tanstack/react-query";

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
