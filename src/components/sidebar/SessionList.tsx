"use client";

import { type SessionInfo, useSessionInfoList } from "@/apis/sessions";
import { useSessionStore } from "@/stores/sessionStore";
import { useEffect } from "react";
import SessionItem from "./SessionItem";

const SessionList = () => {
  const { data: sessionInfoList } = useSessionInfoList();
  const { setSelectedSessionId } = useSessionStore();
  useEffect(() => {
    if (sessionInfoList && sessionInfoList.length > 0) {
      setSelectedSessionId(sessionInfoList[0].session_id || null);
    }
  }, [sessionInfoList, setSelectedSessionId]);

  if (!sessionInfoList || sessionInfoList.length === 0) return null;

  return (
    <div className="pb-4 flex flex-col flex-1 min-h-0">
      <h3 className="py-2 text-xl font-bold text-gray-400 uppercase tracking-wider text-left shrink-0">
        세션 목록
      </h3>
      <div className="space-y-1 overflow-y-auto flex-1 min-h-0">
        {sessionInfoList.map((session: SessionInfo) => {
          return <SessionItem key={session.session_id} session={session} />;
        })}
      </div>
    </div>
  );
};

export default SessionList;
