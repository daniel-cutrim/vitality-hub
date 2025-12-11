import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Trophy, Flame } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PontuacaoUsuario } from '@/hooks/useGamification';

interface GamificationHeaderProps {
  pontuacao: PontuacaoUsuario | null;
  nivelAtual: { nome: string; descricao: string };
  progressoNivel: number;
  pontosProximoNivel: number;
  streakMultiplier: number;
}

export function GamificationHeader({
  pontuacao,
  nivelAtual,
  progressoNivel,
  pontosProximoNivel,
  streakMultiplier,
}: GamificationHeaderProps) {
  const { profile } = useAuth();

  const initials = profile?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-5 border border-primary/20"
    >
      <div className="flex items-center gap-4">
        {/* Avatar with circular progress */}
        <div className="relative">
          <svg className="w-20 h-20 -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="4"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={226}
              initial={{ strokeDashoffset: 226 }}
              animate={{ strokeDashoffset: 226 - (226 * progressoNivel) / 100 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <Avatar className="absolute inset-2 w-16 h-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Level info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Nível {pontuacao?.nivel_atual || 1}</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">{nivelAtual.nome}</h2>
          <p className="text-sm text-muted-foreground">{nivelAtual.descricao}</p>
          
          <div className="mt-2 flex items-center gap-2">
            <Progress value={progressoNivel} className="h-2 flex-1" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {pontosProximoNivel > 0 ? `${pontosProximoNivel} pts` : 'MAX'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">
            {pontuacao?.pontos_totais.toLocaleString() || 0}
          </p>
          <p className="text-xs text-muted-foreground">Pontos Totais</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-2xl font-bold text-foreground">
              {pontuacao?.streak_dias || 0}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Dias de Streak</p>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold text-primary">×{streakMultiplier}</p>
          <p className="text-xs text-muted-foreground">Multiplicador</p>
        </div>
      </div>
    </motion.div>
  );
}
