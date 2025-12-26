"use client";
import { useSessionInfo } from "@/apis/sessions";
import { useSessionStore } from "@/stores/sessionStore";
import TabSection from "./TabSection";
import Welcome from "./Welcome";

export default function MainContent() {
  const { selectedSessionId } = useSessionStore();

  const { data } = useSessionInfo(selectedSessionId);
  const isJobStarted = data?.jobs && data.jobs.length > 0;
  return (
    <main className="flex-1 flex flex-col min-w-0 bg-white h-full min-h-0">
      {isJobStarted ? <TabSection /> : <Welcome />}
    </main>
  );
}
