import { BarChart3 } from "lucide-react";
import { TabsTrigger } from "../ui/tabs";

const TabItem = ({ jobId }: { jobId: string }) => {
  return (
    <TabsTrigger value={jobId}>
      <BarChart3 className="size-4 text-blue-600" />
      <span>{jobId}</span>
      <span className="ml-1 flex items-center gap-1">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-gray-600">
          5
        </span>
      </span>
    </TabsTrigger>
  );
};

export default TabItem;
