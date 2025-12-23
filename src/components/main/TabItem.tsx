import { BarChart3, X } from "lucide-react";
import { useMemo } from "react";
import { useDeleteJob, useJobInfo } from "@/apis/jobs";
import { useMethods } from "@/apis/method";
import { type AnalysisJob, useSessionInfo } from "@/apis/sessions";
import { useAlertActions } from "@/stores/alertStore";
import { useSessionStore } from "@/stores/sessionStore";
import { TabsTrigger } from "../ui/tabs";

interface TabItemProps extends AnalysisJob {}

const TabItem = ({ job_id, task_type }: TabItemProps) => {
  const { data: jobInfo } = useJobInfo(job_id);
  const { confirm } = useAlertActions();
  const { selectedJobId, setSelectedJobId, selectedSessionId } =
    useSessionStore();
  const { data: sessionInfo } = useSessionInfo(selectedSessionId);
  const { mutateAsync: deleteJob } = useDeleteJob();

  const contentsCount = useMemo(() => {
    return jobInfo?.steps?.flatMap((step) => step.artifacts).length ?? 0;
  }, [jobInfo?.steps]);
  const { data: methods } = useMethods();
  const categoryFlatList = Object.entries(methods ?? {}).flatMap(
    ([, value]) => {
      return Object.entries(value.items).map(([key, value]) => {
        return { key, value: value.label };
      });
    },
  );
  const categoryName = categoryFlatList.find(
    (item) => item.key === task_type,
  )?.value;

  const handleDeleteJob = () => {
    confirm({
      title: "정말 삭제하시겠습니까?",
      description: "삭제하면 복구할 수 없습니다.",
      onConfirm: async () => {
        await deleteJob(job_id);
        if (selectedJobId === job_id) {
          const nextJob = sessionInfo?.jobs?.find(
            (job) => job.job_id !== job_id,
          );
          if (nextJob) {
            setSelectedJobId(nextJob.job_id || null);
          }
        }
      },
    });
  };

  return (
    <TabsTrigger value={job_id}>
      <BarChart3 className="size-4 text-blue-600" />
      <span>{categoryName}</span>
      <span className="ml-1 flex items-center gap-1">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-gray-600">
          {contentsCount}
        </span>
      </span>
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteJob();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            handleDeleteJob();
          }
        }}
        className="cursor-pointer"
        aria-label="작업 삭제"
      >
        <X className="size-4" />
      </div>
    </TabsTrigger>
  );
};

export default TabItem;
