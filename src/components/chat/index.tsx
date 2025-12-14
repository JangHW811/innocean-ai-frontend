"use client";

import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/sessionStore";
import { useRef } from "react";
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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  console.log("Chat", selectedJobId);
  return (
    <section className={containerClassName}>
      <div
        ref={scrollContainerRef}
        className="flex h-full flex-col items-center justify-between px-4 py-6 pb-0 gap-8 overflow-y-auto"
      >
        <ChatGuide />
        {selectedJobId && (
          <>
            <ChatHistory
              scrollContainerRef={
                scrollContainerRef as React.RefObject<HTMLDivElement>
              }
            />
            <ChatInput />
          </>
        )}
      </div>
    </section>
  );
};

export default Chat;
