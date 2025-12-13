import { useSessionInfo } from "@/apis/sessions";
import { useSessionStore } from "@/stores/sessionStore";
import { Tabs, TabsList } from "../ui/tabs";
import TabContents from "./TabContents";
import TabItem from "./TabItem";

const TabSection = () => {
  const { selectedJobId, setSelectedJobId, selectedSessionId } =
    useSessionStore();
  const { data: sessionInfo } = useSessionInfo(selectedSessionId);

  const jobs = sessionInfo?.jobs || [];

  console.log("jobs", jobs);
  return (
    <section className="flex-1 flex flex-col min-w-0 px-4 py-12">
      <Tabs
        defaultValue={jobs[0].job_id}
        onValueChange={(value) => setSelectedJobId(value)}
      >
        <TabsList>
          {jobs.map((job) => (
            <TabItem key={job.job_id} {...job} />
          ))}
        </TabsList>
        {jobs.map((job) => (
          <TabContents key={job.job_id} {...job} />
        ))}
      </Tabs>
    </section>
  );
};

export default TabSection;
