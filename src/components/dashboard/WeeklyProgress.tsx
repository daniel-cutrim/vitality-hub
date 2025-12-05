import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeeklyProgressProps {
  completedDays: number[];
}

const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

export function WeeklyProgress({ completedDays }: WeeklyProgressProps) {
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card rounded-xl border border-border p-4"
    >
      <h3 className="font-semibold text-foreground mb-4">Progresso Semanal</h3>
      <div className="flex justify-between gap-1">
        {days.map((day, index) => {
          const isCompleted = completedDays.includes(index);
          const isToday = index === adjustedToday;

          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <span className={cn(
                "text-xs font-medium",
                isToday ? "text-primary" : "text-muted-foreground"
              )}>
                {day}
              </span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                  isCompleted 
                    ? "bg-primary text-primary-foreground" 
                    : isToday 
                      ? "bg-accent border-2 border-primary"
                      : "bg-secondary"
                )}
              >
                {isCompleted && <Check className="w-4 h-4" />}
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
