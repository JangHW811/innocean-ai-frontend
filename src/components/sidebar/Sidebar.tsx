"use client";

import { useMemo } from "react";
import { useSessionInfo } from "@/apis/sessions";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/sessionStore";
import AvailableAnalysis from "./AvailableAnalysis";
import DataUpload from "./DataUpload";
import NewSessionCard from "./NewSessionCard";

export default function Sidebar() {
  const { selectedSessionId } = useSessionStore();

  const { data: sessionInfo } = useSessionInfo(selectedSessionId || "");

  const selectedFileIdList = useMemo(() => {
    return sessionInfo?.file_ids || [];
  }, [sessionInfo?.file_ids]);

  const { isFileVisible, isTaskVisible } = useMemo(() => {
    return {
      isFileVisible: selectedSessionId,
      isTaskVisible: selectedSessionId && selectedFileIdList.length > 0,
    };
  }, [selectedFileIdList, selectedSessionId]);

  return (
    <aside className="w-82 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10">
      <section className="bg-slate-900 transition-all duration-300 flex-1">
        <NewSessionCard />
      </section>
      <section
        className={cn(
          "overflow-y-auto transition-height duration-300",
          isFileVisible ? "max-h-80 h-auto min-h-66" : "max-h-0",
        )}
      >
        <DataUpload />
      </section>
      <section
        className={cn(
          "overflow-y-auto transition-height duration-300",
          isTaskVisible ? "max-h-160 h-auto" : "max-h-0",
        )}
      >
        <AvailableAnalysis />
      </section>
    </aside>
  );
}
