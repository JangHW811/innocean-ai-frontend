"use client";
import { Settings } from "lucide-react";
import { useSessionInfo } from "@/apis/sessions";
import { useSessionStore } from "@/stores/sessionStore";
import TabSection from "./TabSection";
import Welcome from "./Welcome";

export default function MainContent() {
  const { selectedSessionId } = useSessionStore();

  const { data } = useSessionInfo(selectedSessionId);
  const isJobStarted = data?.job_ids && data.job_ids.length > 0;
  return (
    <main className="flex-1 flex flex-col min-w-0 bg-white">
      {isJobStarted ? <TabSection /> : <Welcome />}
      <div className="fixed bottom-8 right-8">
        <button type="button" className="shadow-lg rounded-full">
          <div className="w-10 h-10 bg-white text-gray-600 rounded-full border border-gray-100 flex items-center justify-center hover:rotate-90 transition-transform duration-300">
            <Settings className="w-5 h-5 " />
          </div>
        </button>
      </div>
    </main>
  );
}
