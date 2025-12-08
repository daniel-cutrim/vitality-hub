import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  to: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  badge?: ReactNode;
  delay?: number;
  locked?: boolean;
  onLockedClick?: () => void;
  onClick?: () => void;
}

export function DashboardCard({
  to,
  icon: Icon,
  title,
  subtitle,
  badge,
  delay = 0,
  locked = false,
  onLockedClick,
  onClick
}: DashboardCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={cn(
        "card-interactive p-4 flex items-center gap-4",
        locked && "opacity-75"
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground truncate">{title}</h3>
          {badge}
        </div>
        <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
    </motion.div>
  );

  if (locked && onLockedClick) {
    return (
      <button onClick={onLockedClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return <Link to={to}>{content}</Link>;
}
