"use client";

import type { SessionInfo } from "@/apis/sessions";
import dayjs from "dayjs";
import { MessageSquare } from "lucide-react";

import { useSessionStore } from "@/stores/sessionStore";
import SessionConfigMenu from "./SessionConfigMenu";

const SessionItem = ({ session }: { session: SessionInfo }) => {
  const { session_id, name, description, created_at } = session;
  const { selectedSessionId, setSelectedSessionId, setSelectedJobId } =
    useSessionStore();
  const isSelected = selectedSessionId === session_id;

  const handleSelectSession = () => {
    setSelectedSessionId(session_id || null);

    setSelectedJobId(session.jobs?.[0]?.job_id || null);
  };
  return (
    <div
      key={session_id}
      role="button"
      tabIndex={0}
      onClick={handleSelectSession}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelectSession();
        }
      }}
      className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg transition-colors group cursor-pointer ${
        isSelected
          ? "bg-slate-600 hover:bg-slate-500"
          : "bg-slate-800 hover:bg-gray-700"
      }`}
    >
      <div className="flex-1 min-w-0 text-left">
        <div className="text-sm font-semibold text-gray-200 truncate flex items-center">
          <div className="mt-0.5 shrink-0 mr-2">
            <MessageSquare className="w-5 h-5 text-gray-300" />
          </div>
          {name || description || "새 분석"}
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-200">
          <span>{dayjs(created_at).format("YYYY-MM-DD HH:mm")}</span>
        </div>
      </div>
      <SessionConfigMenu session_id={session_id} />
    </div>
  );
};

export default SessionItem;
