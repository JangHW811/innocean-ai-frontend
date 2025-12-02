import { useSessionInfo } from "@/apis/sessions";
import { useSessionStore } from "@/stores/sessionStore";
import { Tabs, TabsList } from "../ui/tabs";
import TabContents from "./TabContents";
import TabItem from "./TabItem";

const TabSection = () => {
  const { selectedJobId, setSelectedJobId, selectedSessionId } =
    useSessionStore();
  const { data: sessionInfo } = useSessionInfo(selectedSessionId);

  const jobIds = sessionInfo?.job_ids || [];

  console.log(selectedJobId);
  return (
    <section className="flex-1 flex flex-col min-w-0 px-4 py-12">
      <Tabs
        defaultValue={jobIds[0]}
        onValueChange={(value) => setSelectedJobId(value)}
      >
        <TabsList>
          {jobIds.map((jobId) => (
            <TabItem key={jobId} jobId={jobId} />
          ))}
        </TabsList>
        {jobIds.map((jobId) => (
          <TabContents key={jobId} jobId={jobId} />
        ))}
      </Tabs>
    </section>
  );
};

export default TabSection;
