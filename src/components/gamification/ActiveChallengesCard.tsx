import { motion } from 'framer-motion';
import { Target, Users, Swords, User, Clock, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Desafio } from '@/hooks/useGamification';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActiveChallengesCardProps {
  desafios: Desafio[];
  onChallengeClick: (desafio: Desafio) => void;
}

export function ActiveChallengesCard({
  desafios,
  onChallengeClick,
}: ActiveChallengesCardProps) {
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'individual':
        return <User className="w-4 h-4" />;
      case 'versus':
        return <Swords className="w-4 h-4" />;
      case 'grupo':
        return <Users className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getTipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'individual':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'versus':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'grupo':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default:
        return '';
    }
  };

  const getTimeRemaining = (fim: string | null) => {
    if (!fim) return 'Sem prazo';
    const endDate = new Date(fim);
    if (endDate < new Date()) return 'Encerrado';
    return formatDistanceToNow(endDate, { locale: ptBR, addSuffix: false });
  };

  return (
    <Card className="card-interactive">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Meus Desafios Ativos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {desafios.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">Nenhum desafio ativo</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Crie seu primeiro desafio!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {desafios.slice(0, 3).map((desafio, index) => (
              <motion.button
                key={desafio.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onChallengeClick(desafio)}
                className="w-full p-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all text-left active:scale-[0.98]"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">
                      {desafio.nome}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={cn('text-xs', getTipoBadgeColor(desafio.tipo))}
                      >
                        {getTipoIcon(desafio.tipo)}
                        <span className="ml-1 capitalize">{desafio.tipo}</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {getTimeRemaining(desafio.fim)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">
                      0/{desafio.meta_numero} {desafio.meta === 'treinos_completos' ? 'treinos' : 'pts'}
                    </span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Trophy className="w-3 h-3 text-primary" />
                    <span>+{desafio.recompensa_pontos} pts</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
