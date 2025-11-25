import { MessageSquare } from "lucide-react";
import { useSessionInfoList } from "@/apis/sessions";
import CreateSessionModal from "./CreateSessionModal";
import SessionList from "./SessionList";

export default function NewSessionCard() {
  const { data: sessionInfoList } = useSessionInfoList();
  const isEmpty = sessionInfoList?.length === 0;
  const emptyContent = (
    <div className="flex flex-col items-center text-center gap-2">
      <MessageSquare className="w-8 h-8 text-indigo-300 mx-auto" />
      <h3 className="font-semibold text-sm">새 분석 세션 시작하기</h3>
      <p className="text-xs text-slate-400">
        데이터를 기반으로 대화를 시작해보세요.
      </p>
    </div>
  );
  return (
    <div className="bg-slate-900 p-5 text-white shadow-lg relative overflow-hidden group">
      <div className="relative z-10 flex flex-col items-center text-center space-y-3">
        <div className="w-full">
          {isEmpty ? emptyContent : <SessionList />}
          <CreateSessionModal />
        </div>
      </div>
    </div>
  );
}
