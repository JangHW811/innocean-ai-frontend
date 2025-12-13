import {
  BarChart3,
  LucideIcon,
  NotebookPen,
  Target,
  UploadCloud,
} from "lucide-react";
const ChatGuide = () => {
  return (
    <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-xl backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
        Welcome
      </p>
      <p className="mt-3 text-sm text-slate-500">
        데이터를 업로드하여 분석을 시작해보세요.
      </p>

      <div className="mt-8 grid gap-3 text-left text-sm text-slate-500">
        <MiniPoint
          icon={Target}
          label="분석목표를 설정하고 세션을 생성하세요."
        />
        <MiniPoint
          icon={UploadCloud}
          label="파일을 업로드하고 분석에 필요한 데이터를 선택하세요."
        />
        <MiniPoint icon={BarChart3} label="원하는 분석타입을 선택해주세요." />
        <MiniPoint
          icon={NotebookPen}
          label="전처리 요구사항을 입력하여 분석을 시작하세요."
        />
      </div>
    </div>
  );
};

const MiniPoint = ({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) => (
  <div className="flex items-center gap-3 rounded-2xl border border-slate-100/80 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm">
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
      <Icon className="h-4 w-4" />
    </span>
    {label}
  </div>
);
export default ChatGuide;
