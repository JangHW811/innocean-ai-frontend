import { useJobInfo } from "@/apis/jobs";
import { useMethods } from "@/apis/method";
import { AnalysisJob } from "@/apis/sessions";
import { BarChart3 } from "lucide-react";
import { useMemo } from "react";
import { TabsTrigger } from "../ui/tabs";

interface TabItemProps extends AnalysisJob {}

const TabItem = ({ job_id, task_type }: TabItemProps) => {
  const { data: jobInfo } = useJobInfo(job_id);

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

  return (
    <TabsTrigger value={job_id}>
      <BarChart3 className="size-4 text-blue-600" />
      <span>{categoryName}</span>
      <span className="ml-1 flex items-center gap-1">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-gray-600">
          {contentsCount}
        </span>
      </span>
    </TabsTrigger>
  );
};

export default TabItem;
