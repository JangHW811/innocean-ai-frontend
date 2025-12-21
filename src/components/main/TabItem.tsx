import { useDeleteJob, useJobInfo } from "@/apis/jobs";
import { useMethods } from "@/apis/method";
import { AnalysisJob } from "@/apis/sessions";
import { useAlertActions } from "@/stores/alertStore";
import { BarChart3, X } from "lucide-react";
import { useMemo } from "react";
import { TabsTrigger } from "../ui/tabs";

interface TabItemProps extends AnalysisJob {}

const TabItem = ({ job_id, task_type }: TabItemProps) => {
  const { data: jobInfo } = useJobInfo(job_id);
  const { confirm } = useAlertActions();
  const { mutate: deleteJob } = useDeleteJob();

  const contentsCount = useMemo(() => {
    return jobInfo?.steps?.flatMap((step) => step.artifacts).length ?? 0;
  }, [jobInfo?.steps]);
  const { data: methods } = useMethods();
  const categoryFlatList = Object.entries(methods ?? {}).flatMap(
    ([, value]) => {
      return Object.entries(value.items).map(([key, value]) => {
        return { key, value: value.label };
      });
    }
  );
  const categoryName = categoryFlatList.find(
    (item) => item.key === task_type
  )?.value;

  const handleDeleteJob = () => {
    confirm({
      title: "정말 삭제하시겠습니까?",
      description: "삭제하면 복구할 수 없습니다.",
      onConfirm: () => {
        deleteJob(job_id);
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
      <a className="cursor-pointer" onClick={handleDeleteJob}>
        <X className="size-4" />
      </a>
    </TabsTrigger>
  );
};

export default TabItem;
