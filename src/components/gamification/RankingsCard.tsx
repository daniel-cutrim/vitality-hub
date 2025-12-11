import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RankingItem } from '@/hooks/useGamification';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface RankingsCardProps {
  generateRankings: (periodo: 'semanal' | 'mensal' | 'geral') => RankingItem[];
  loading?: boolean;
}

export function RankingsCard({ generateRankings, loading }: RankingsCardProps) {
  const [periodo, setPeriodo] = useState<'semanal' | 'mensal' | 'geral'>('semanal');
  const rankings = generateRankings(periodo);
  const currentUser = rankings.find((r) => r.isCurrentUser);
  const top10 = rankings.slice(0, 10);

  const getMedalIcon = (posicao: number) => {
    switch (posicao) {
      case 1:
        return <Crown className="w-5 h-5 text-amber-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 text-center text-sm font-bold text-muted-foreground">#{posicao}</span>;
    }
  };

  const getPositionStyle = (posicao: number) => {
    switch (posicao) {
      case 1:
        return 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 border-amber-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-400/10 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-600/10 border-amber-600/30';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Card className="card-interactive">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-interactive">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={periodo} onValueChange={(v) => setPeriodo(v as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="semanal">Semanal</TabsTrigger>
            <TabsTrigger value="mensal">Mensal</TabsTrigger>
            <TabsTrigger value="geral">Geral</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={periodo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Top 10 list */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {top10.map((item, index) => (
                  <motion.div
                    key={item.user_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'flex items-center gap-3 p-2 rounded-lg border border-transparent transition-colors',
                      getPositionStyle(item.posicao),
                      item.isCurrentUser && 'bg-primary/10 border-primary/30'
                    )}
                  >
                    <div className="w-8 flex justify-center">
                      {getMedalIcon(item.posicao)}
                    </div>
                    
                    <Avatar className="w-10 h-10">
                      <AvatarFallback 
                        style={{ backgroundColor: item.avatar_cor }}
                        className="text-white text-sm font-semibold"
                      >
                        {item.avatar_iniciais}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'font-medium text-sm truncate',
                        item.isCurrentUser && 'text-primary font-semibold'
                      )}>
                        {item.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Nível {item.nivel}
                      </p>
                    </div>

                    <p className="font-bold text-sm">
                      {item.pontos.toLocaleString()}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Current user position if not in top 10 */}
              {currentUser && currentUser.posicao > 10 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Sua posição</p>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 border border-primary/30">
                    <div className="w-8 flex justify-center">
                      <span className="text-sm font-bold text-primary">
                        #{currentUser.posicao}
                      </span>
                    </div>
                    
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                        {currentUser.avatar_iniciais}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-primary truncate">
                        {currentUser.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {rankings[0] && currentUser.posicao > 1 && (
                          <>-{(rankings[0].pontos - currentUser.pontos).toLocaleString()} pts do 1º</>
                        )}
                      </p>
                    </div>

                    <p className="font-bold text-sm">
                      {currentUser.pontos.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Total participants */}
              <p className="text-xs text-center text-muted-foreground mt-4">
                {rankings.length.toLocaleString()} participantes
              </p>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  );
}
