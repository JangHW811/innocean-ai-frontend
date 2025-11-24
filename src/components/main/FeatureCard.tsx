import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  label: string;
  bgColor: string;
  iconColor: string;
}

export default function FeatureCard({
  icon: Icon,
  label,
  bgColor,
  iconColor,
}: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 border border-gray-100">
      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', bgColor, iconColor)}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
  );
}

