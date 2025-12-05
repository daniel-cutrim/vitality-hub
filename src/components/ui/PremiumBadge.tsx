import { Crown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  isPremium: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function PremiumBadge({ isPremium, size = 'sm', className }: PremiumBadgeProps) {
  if (isPremium) {
    return (
      <span className={cn(
        "badge-premium inline-flex items-center gap-1",
        size === 'md' && "px-3 py-1 text-sm",
        className
      )}>
        <Crown className={size === 'sm' ? "w-3 h-3" : "w-4 h-4"} />
        Premium
      </span>
    );
  }

  return (
    <span className={cn(
      "badge-free inline-flex items-center gap-1",
      size === 'md' && "px-3 py-1 text-sm",
      className
    )}>
      <Sparkles className={size === 'sm' ? "w-3 h-3" : "w-4 h-4"} />
      Free
    </span>
  );
}
