import { useJobInfo } from "@/apis/jobs";
import { AnalysisJob } from "@/apis/sessions";
import { Label } from "../ui/label";
import { TabsContent } from "../ui/tabs";
import DeepAnalysisModal from "./DeepAnalysisModal";
interface TabSectionProps extends AnalysisJob {}

const TabContents = ({ job_id }: TabSectionProps) => {
  const { data: jobInfo } = useJobInfo(job_id);
  console.log("SSSS", jobInfo);
  return (
    <TabsContent value={job_id} className="mt-6">
      <Label>EDA: 탐색적 데이터 분석 콘텐츠</Label>
      <DeepAnalysisModal />
    </TabsContent>
  );
};

export default TabContents;
