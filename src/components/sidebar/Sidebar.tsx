"use client";

import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/sessionStore";
import { useMemo } from "react";
import AvailableAnalysis from "./AvailableAnalysis";
import DataUpload from "./DataUpload";
import NewSessionCard from "./NewSessionCard";

export default function Sidebar() {
  const { selectedSessionId, selectedFileIdList } = useSessionStore();

  const { isFileVisible, isTaskVisible } = useMemo(() => {
    return {
      isFileVisible: selectedSessionId,
      isTaskVisible: selectedSessionId && selectedFileIdList.length > 0,
    };
  }, [selectedFileIdList, selectedSessionId]);
  return (
    <aside className="w-82 bg-white border-r border-gray-200 flex flex-col h-full min-h-0 shadow-sm z-10">
      <section className="bg-slate-900 transition-all duration-300 flex-6 min-h-48 flex flex-col">
        <NewSessionCard />
      </section>
      <section
        className={cn(
          "transition-height duration-300 flex-2",
          isFileVisible
            ? "min-h-40 overflow-y-auto max-h-56"
            : "max-h-0 overflow-hidden"
        )}
      >
        <DataUpload />
      </section>
      <section
        className={cn(
          "flex flex-col transition-height duration-300 flex-6",
          isTaskVisible
            ? "min-h-70 overflow-y-auto max-h-90"
            : "max-h-0 overflow-hidden"
        )}
      >
        <AvailableAnalysis />
      </section>
    </aside>
  );
}
