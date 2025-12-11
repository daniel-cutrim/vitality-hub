import { motion } from 'framer-motion';
import { Trophy, Flame, TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '@/hooks/useGamification';

export function GamificationDashboardCard() {
  const navigate = useNavigate();
  const { pontuacao, nivelAtual, loading } = useGamification();

  if (loading) {
    return (
      <div className="card-interactive p-4 animate-pulse">
        <div className="h-20 bg-muted rounded-lg" />
      </div>
    );
  }

  const todayPoints = 0; // Would come from historico filtered by today

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate('/desafios')}
      className="card-interactive p-4 w-full text-left"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">Nível {pontuacao?.nivel_atual || 1}</p>
            <p className="text-xs text-primary font-medium">{nivelAtual.nome}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-muted/50 rounded-lg p-2">
          <p className="text-lg font-bold text-primary">+{todayPoints}</p>
          <p className="text-xs text-muted-foreground">Hoje</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-lg font-bold">{pontuacao?.streak_dias || 0}</span>
          </div>
          <p className="text-xs text-muted-foreground">Streak</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-lg font-bold">#--</span>
          </div>
          <p className="text-xs text-muted-foreground">Ranking</p>
        </div>
      </div>
    </motion.button>
  );
}
