import { useSessionInfo } from "@/apis/sessions";
import { useSessionStore } from "@/stores/sessionStore";
import { Tabs, TabsList } from "../ui/tabs";
import TabContents from "./TabContents";
import TabItem from "./TabItem";

const TabSection = () => {
  const { setSelectedJobId, selectedSessionId, selectedJobId } =
    useSessionStore();
  const { data: sessionInfo } = useSessionInfo(selectedSessionId);

  return (
    <section className="flex-1 flex flex-col min-w-0 px-4 py-12 h-full min-h-0">
      <Tabs
        defaultValue={sessionInfo?.jobs?.[0]?.job_id}
        value={selectedJobId ?? sessionInfo?.jobs?.[0]?.job_id ?? ""}
        onValueChange={(value) => setSelectedJobId(value)}
        className="flex flex-col h-full min-h-0"
      >
        <TabsList className="shrink-0 overflow-x-auto">
          {sessionInfo?.jobs?.map((job) => (
            <TabItem key={job.job_id} {...job} />
          ))}
        </TabsList>
        {sessionInfo?.jobs?.map((job) => (
          <TabContents key={job.job_id} {...job} />
        ))}
      </Tabs>
    </section>
  );
};

export default TabSection;
