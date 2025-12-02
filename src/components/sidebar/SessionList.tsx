"use client";

import { useEffect } from "react";
import { type SessionInfo, useSessionInfoList } from "@/apis/sessions";
import { useSessionStore } from "@/stores/sessionStore";
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
    <div className="pb-4">
      <h3 className="py-2 text-xl font-bold text-gray-400 uppercase tracking-wider text-left">
        세션 목록
      </h3>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {sessionInfoList.map((session: SessionInfo) => {
          return <SessionItem key={session.session_id} session={session} />;
        })}
      </div>
    </div>
  );
};

export default SessionList;
