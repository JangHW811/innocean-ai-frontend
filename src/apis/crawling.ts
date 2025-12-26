import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CrawlingRegistFormValues } from "@/components/modals/NaverCrawlingRegistModal";
import { useAuthStore } from "@/stores/authStore";
import { http } from "./common";

export interface CrawlingListParams {
  title?: string;
  advertiser?: string;
  team?: string;
  manager?: string;
  page?: number;
  size?: number;
}

export interface CrawlingListResponse {
  items: CrawlingListItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CrawlingListItem {
  segment_num: number;
  usage: number;
  id: string;
  user_id: string;
  title: string;
  start_date: string;
  time_unit: string;
  content: string;
  advertiser: string;
  team: string;
  manager: string;
  input_file_path: string;
  output_file_path: string;
  status: string;
  created_at: string;
  started_at: string;
  finished_at: string;
}

const useCrawlingList = (params: CrawlingListParams) => {
  return useQuery<CrawlingListResponse>({
    queryKey: ["/api/search-jobs", { ...params, size: 10 }],
  });
};

export interface CrawlingRegistResponse {
  segment_num: number;
  usage: number;
  id: string;
  user_id: string;
  title: string;
  start_date: string;
  time_unit: string;
  content: string;
  advertiser: string;
  team: string;
  manager: string;
  input_file_path: string;
  output_file_path: string;
  status: string;
  created_at: string;
  started_at: string;
  finished_at: string;
}

export const useCrawlingRegist = () => {
  const { id } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation<CrawlingRegistResponse, Error, CrawlingRegistFormValues>({
    mutationFn: (data: CrawlingRegistFormValues) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });
      formData.append("user_id", id ?? "");

      return http.multipart<CrawlingRegistResponse>(
        "/api/search-jobs",
        formData,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/search-jobs"] });
    },
  });
};

export const useCrawlingDelete = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (job_id: string) => {
      return http.delete(`/api/search-jobs/${job_id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/search-jobs"] });
    },
  });
};

export const useCrawlingDownload = () => {
  return useMutation<void, Error, string>({
    mutationFn: (job_id: string) => {
      return http.get(`/api/search-jobs/${job_id}/download`);
    },
  });
};

export default useCrawlingList;
