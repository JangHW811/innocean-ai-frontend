import { useJobInfo } from "@/apis/sessions";
import { Label } from "../ui/label";
import { TabsContent } from "../ui/tabs";
import DeepAnalysisModal from "./DeepAnalysisModal";

const TabContents = ({ jobId }: { jobId: string }) => {
  const { data: jobInfo } = useJobInfo(jobId);
  console.log("SSSS", jobInfo);
  return (
    <TabsContent value={jobId} className="mt-6">
      <Label>EDA: 탐색적 데이터 분석 콘텐츠</Label>
      <DeepAnalysisModal />
    </TabsContent>
  );
};

export default TabContents;
