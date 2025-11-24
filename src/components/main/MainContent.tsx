import { BarChart3, Clock, FileText, Settings, TrendingUp } from "lucide-react";
import FeatureCard from "./FeatureCard";

export default function MainContent() {
  return (
    <main className="flex-1 flex flex-col min-w-0 bg-white">
      <div className="flex-1 flex flex-col items-center justify-center p-10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none"></div>

        <div className="max-w-2xl w-full text-center space-y-8 z-10">
          <div className="space-y-4 animate-fade-in-up">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Welcome to <span className="text-indigo-600">PunkConsole</span>
            </h2>
            <p className="text-lg text-gray-500">
              AI와 대화하며 데이터를 분석하고 인사이트를 발견하세요.
              <br />
              로그인하여 나만의 분석 세션을 시작할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            <FeatureCard
              icon={BarChart3}
              label="스마트 차트"
              bgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            <FeatureCard
              icon={TrendingUp}
              label="관계 그래프"
              bgColor="bg-purple-100"
              iconColor="text-purple-600"
            />
            <FeatureCard
              icon={Clock}
              label="시계열 분석"
              bgColor="bg-green-100"
              iconColor="text-green-600"
            />
            <FeatureCard
              icon={FileText}
              label="자동 리포트"
              bgColor="bg-orange-100"
              iconColor="text-orange-600"
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8">
        <button
          type="button"
          className="w-12 h-12 bg-white text-gray-600 rounded-full shadow-lg border border-gray-100 flex items-center justify-center hover:rotate-90 transition-transform duration-300"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </main>
  );
}
