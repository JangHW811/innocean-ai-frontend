import type { LucideIcon } from "lucide-react";
import {
  Award,
  BarChart3,
  Clock,
  Compass,
  Heart,
  Home,
  Image,
  Key,
  Layers,
  Lightbulb,
  MessageSquare,
  Target,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";

export interface Analysis {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface AnalysisCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  analyses: Analysis[];
}

export const analysisCategories: AnalysisCategory[] = [
  {
    id: "trend",
    title: "트렌드분석",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    analyses: [
      {
        id: "interest-trend",
        title: "카테고리/브랜드 관심도 추이 분석",
        description: "시간에 따른 관심도 변화 패턴 분석",
        icon: BarChart3,
      },
      {
        id: "discourse",
        title: "카테고리/브랜드 관련 주요 담론 분석",
        description: "주요 이슈와 담론 트렌드 분석",
        icon: MessageSquare,
      },
      {
        id: "emerging",
        title: "이머징 시그널 분석",
        description: "신규 트렌드와 약한 신호 포착",
        icon: Zap,
      },
    ],
  },
  {
    id: "consumer",
    title: "소비자분석",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50",
    analyses: [
      {
        id: "demographic",
        title: "데모그래픽 특성 분석",
        description: "연령, 성별, 지역 등 기본 특성",
        icon: User,
      },
      {
        id: "lifestyle",
        title: "라이프스타일 특성 분석",
        description: "생활 패턴과 가치관 분석",
        icon: Home,
      },
      {
        id: "needs-trigger",
        title: "Needs & Trigger 분석",
        description: "소비자 니즈와 구매 유발 요인",
        icon: Target,
      },
      {
        id: "unmet-need",
        title: "Unmet Need & Barrier 분석",
        description: "충족되지 않은 니즈와 장벽 요인",
        icon: Key,
      },
      {
        id: "kbf",
        title: "KBF 분석",
        description: "Key Buying Factor 핵심 구매 요인",
        icon: Award,
      },
      {
        id: "usage-moment",
        title: "카테고리 Usage & Moment",
        description: "사용 상황과 구매 시점 분석",
        icon: Clock,
      },
    ],
  },
  {
    id: "brand",
    title: "브랜드 경쟁력 분석",
    icon: Award,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    analyses: [
      {
        id: "preference",
        title: "브랜드 선호/비선호 요인 분석",
        description: "브랜드에 대한 긍정/부정 요인",
        icon: Heart,
      },
      {
        id: "brand-needs",
        title: "Needs & Trigger 분석",
        description: "브랜드 관련 니즈와 트리거",
        icon: Target,
      },
      {
        id: "brand-unmet",
        title: "Unmet Needs & Barrier 분석",
        description: "브랜드 관련 미충족 니즈",
        icon: Key,
      },
      {
        id: "brand-kbf",
        title: "KBF 분석",
        description: "브랜드 선택 핵심 요인",
        icon: Award,
      },
      {
        id: "brand-usage",
        title: "브랜드 Usage & Moment 분석",
        description: "브랜드 사용 맥락과 순간",
        icon: Clock,
      },
      {
        id: "brand-image",
        title: "브랜드 이미지 분석",
        description: "브랜드 연상과 이미지 맵핑",
        icon: Image,
      },
      {
        id: "brand-model",
        title: "이노션 브랜드 니즈 모델 분석",
        description: "전문적인 브랜드 니즈 프레임워크",
        icon: Lightbulb,
      },
    ],
  },
  {
    id: "segmentation",
    title: "소비자 유형화",
    icon: UserCheck,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    analyses: [
      {
        id: "segmentation",
        title: "세그멘테이션 분석",
        description: "소비자 그룹 분류와 특성 도출",
        icon: Layers,
      },
      {
        id: "persona",
        title: "페르소나 분석",
        description: "대표 소비자 유형 프로파일링",
        icon: UserCheck,
      },
    ],
  },
  {
    id: "strategy",
    title: "브랜드 전략 방향 분석",
    icon: Compass,
    color: "text-red-600",
    bgColor: "bg-red-50",
    analyses: [
      {
        id: "opportunity",
        title: "브랜드 기회 영역 도출",
        description: "시장 기회와 브랜드 포지셔닝",
        icon: Compass,
      },
    ],
  },
];
