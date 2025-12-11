import { motion } from 'framer-motion';
import { TrendingUp, Award, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoricoPontos, UsuarioBadge } from '@/hooks/useGamification';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ProgressCardProps {
  pontosTotais: number;
  streakDias: number;
  multiplicador: number;
  userBadges: UsuarioBadge[];
  totalBadges: number;
  historico: HistoricoPontos[];
  onBadgesClick: () => void;
}

export function ProgressCard({
  pontosTotais,
  streakDias,
  multiplicador,
  userBadges,
  totalBadges,
  historico,
  onBadgesClick,
}: ProgressCardProps) {
  // Group historico by day for chart
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayPoints = historico
      .filter((h) => h.created_at.startsWith(dateStr))
      .reduce((sum, h) => sum + h.pontos_finais, 0);
    
    return {
      day: date.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3),
      points: dayPoints,
    };
  });

  return (
    <Card className="card-interactive">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Meu Progresso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Points highlight */}
        <div className="text-center py-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
          <motion.p
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-primary"
          >
            {pontosTotais.toLocaleString()}
          </motion.p>
          <p className="text-sm text-muted-foreground">Pontos Totais</p>
        </div>

        {/* Streak and badges row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-orange-500">
              <span className="text-2xl">🔥</span>
              <span className="text-2xl font-bold">{streakDias}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              dias consecutivos
            </p>
            {multiplicador > 1 && (
              <p className="text-xs font-semibold text-orange-500 mt-1">
                ×{multiplicador} ativo
              </p>
            )}
          </div>

          <button
            onClick={onBadgesClick}
            className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-xl p-3 text-center transition-transform active:scale-95"
          >
            <div className="flex items-center justify-center gap-1 text-amber-500">
              <Award className="w-5 h-5" />
              <span className="text-2xl font-bold">{userBadges.length}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              /{totalBadges} badges
            </p>
          </button>
        </div>

        {/* Weekly chart */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Últimos 7 dias</span>
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [`${value} pts`, 'Pontos']}
                />
                <Line
                  type="monotone"
                  dataKey="points"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
