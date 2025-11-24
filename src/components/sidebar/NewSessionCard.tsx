import { MessageSquare } from "lucide-react";
import CreateSessionModal from "./CreateSessionModal";

export default function NewSessionCard() {
  return (
    <div className="bg-slate-900 p-5 text-white shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-indigo-500 rounded-full opacity-20 blur-xl"></div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-3">
        <MessageSquare className="w-8 h-8 text-indigo-300" />
        <div className="w-full">
          <h3 className="font-semibold text-sm">새 분석 세션 시작하기</h3>
          <p className="text-xs text-slate-400 mt-1">
            데이터를 기반으로 대화를 시작해보세요.
          </p>
          <CreateSessionModal />
        </div>
      </div>
    </div>
  );
}
