"use client";

import { useSessionInfo } from "@/apis/sessions";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/sessionStore";
import ChatGuide from "./ChatGuide";
import ChatInput from "./ChatInput";
import PreProcRequirementInput from "./PreProcRequirementInput";

const Chat = () => {
  const { selectedSessionId } = useSessionStore();
  const { data } = useSessionInfo(selectedSessionId);
  const isJobStarted = data?.job_ids && data.job_ids.length > 0;
  const containerClassName = cn(
    "flex-1 mx-auto min-h-[calc(100vh-4rem)] max-w-120 max-h-[100vh] overflow-hidden bg-linear-to-br from-slate-50 via-white to-slate-100 transition-all duration-300"
  );

  // const { data: sessionInfo } = useJobInfo(selectedSessionId);
  return (
    <section className={containerClassName}>
      <div className="flex h-full flex-col items-center justify-between px-4 py-12 gap-8">
        <ChatGuide />
        {isJobStarted ? <ChatInput /> : <PreProcRequirementInput />}
      </div>
    </section>
  );
};

export default Chat;
