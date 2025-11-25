"use client";

import {
  MessageSquare,
  MoreVertical,
  Pencil,
  Settings,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useSessionInfoList } from "@/apis/sessions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SessionInfo } from "@/stores/tempSessionStore";

const SessionList = () => {
  const { data: sessionInfoList } = useSessionInfoList();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  console.log("sessionInfoList", selectedId, sessionInfoList);
  if (!sessionInfoList || sessionInfoList.length === 0) return null;

  return (
    <div className="pb-4">
      <h3 className="py-2 text-xl font-bold text-gray-400 uppercase tracking-wider text-left">
        세션 목록
      </h3>
      <div className="space-y-1">
        {sessionInfoList.map((session: SessionInfo) => {
          const isSelected = selectedId === session.id;
          return (
            <button
              key={session.id}
              type="button"
              onClick={() => setSelectedId(session.id || null)}
              className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg transition-colors group ${
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
                  {session.projectSummary ||
                    session.analyticTarget ||
                    "새 분석"}
                  <span className="ml-1 text-xs font-normal text-gray-500">
                    (오프라인)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-200">
                  <span>0개 메시지</span>
                  <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                  <span>{session.createdAt?.format("YYYY-MM-DD HH:mm")}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="group-hover:opacity-100 transition-opacity shrink-0 p-1 hover:bg-gray-600 rounded"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: 이름 변경 기능
                    }}
                    className="cursor-pointer"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    이름 변경
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: 프로젝트 설정 기능
                    }}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    프로젝트 설정
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: 삭제 기능
                    }}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SessionList;
