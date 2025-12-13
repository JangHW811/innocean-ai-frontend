import { AnalysisJob } from "@/apis/sessions";
import { BarChart3 } from "lucide-react";
import { TabsTrigger } from "../ui/tabs";

interface TabItemProps extends AnalysisJob {}

const TabItem = ({ job_id, task_type }: TabItemProps) => {
  return (
    <TabsTrigger value={job_id}>
      <BarChart3 className="size-4 text-blue-600" />
      <span>{task_type}</span>
      <span className="ml-1 flex items-center gap-1">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-gray-600">
          5
        </span>
      </span>
    </TabsTrigger>
  );
};

export default TabItem;
