"use client";

import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/sessionStore";
import ChatGuide from "./ChatGuide";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";

const Chat = () => {
  const {
    selectedSessionId,
    selectedJobType,
    selectedJobId,
    selectedFileIdList,
  } = useSessionStore();
  const containerClassName = cn(
    "flex-1 mx-auto min-h-[calc(100vh-4rem)] max-w-120 max-h-[100vh] overflow-hidden bg-linear-to-br from-slate-50 via-white to-slate-100 transition-all duration-300"
  );

  console.log("selectedJobType", selectedJobType, selectedFileIdList);
  return (
    <section className={containerClassName}>
      <div className="flex h-full flex-col items-center justify-between px-4 py-12 gap-8">
        {!selectedJobId && <ChatGuide />}
        {selectedJobId && (
          <>
            <ChatHistory />
            <ChatInput />
          </>
        )}
      </div>
    </section>
  );
};

export default Chat;
