import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge, UsuarioBadge } from '@/hooks/useGamification';
import { cn } from '@/lib/utils';
import {
  Trophy,
  Target,
  Medal,
  Star,
  Zap,
  Dumbbell,
  Flame,
  Apple,
  Sparkles,
  Crown,
  Users,
  Award,
} from 'lucide-react';

interface BadgesGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badges: Badge[];
  userBadges: UsuarioBadge[];
}

const iconMap: Record<string, React.ComponentType<any>> = {
  trophy: Trophy,
  target: Target,
  medal: Medal,
  star: Star,
  zap: Zap,
  dumbbell: Dumbbell,
  flame: Flame,
  apple: Apple,
  sparkles: Sparkles,
  crown: Crown,
  users: Users,
  award: Award,
};

export function BadgesGalleryModal({
  open,
  onOpenChange,
  badges,
  userBadges,
}: BadgesGalleryModalProps) {
  const userBadgeIds = userBadges.map((ub) => ub.badge_id);

  const badgesByCategory = {
    conquistas: badges.filter((b) => b.categoria === 'conquistas'),
    desafios: badges.filter((b) => b.categoria === 'desafios'),
    rankings: badges.filter((b) => b.categoria === 'rankings'),
    especiais: badges.filter((b) => b.categoria === 'especiais'),
  };

  const renderBadge = (badge: Badge) => {
    const isUnlocked = userBadgeIds.includes(badge.id);
    const Icon = iconMap[badge.icone] || Trophy;
    const userBadge = userBadges.find((ub) => ub.badge_id === badge.id);

    return (
      <motion.div
        key={badge.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'flex flex-col items-center p-4 rounded-xl border transition-all',
          isUnlocked
            ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30'
            : 'bg-muted/50 border-border opacity-50 grayscale'
        )}
      >
        <div
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center mb-2',
            isUnlocked ? 'bg-primary/20' : 'bg-muted'
          )}
        >
          <Icon
            className={cn(
              'w-7 h-7',
              isUnlocked ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        </div>
        <h4
          className={cn(
            'font-semibold text-sm text-center',
            !isUnlocked && 'text-muted-foreground'
          )}
        >
          {badge.nome}
        </h4>
        <p className="text-xs text-muted-foreground text-center mt-1 line-clamp-2">
          {badge.descricao}
        </p>
        {isUnlocked && userBadge && (
          <p className="text-xs text-primary mt-2">
            {new Date(userBadge.conquistado_em).toLocaleDateString('pt-BR')}
          </p>
        )}
      </motion.div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Galeria de Badges
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground mb-4">
          Conquistados: {userBadges.length}/{badges.length}
        </div>

        <Tabs defaultValue="conquistas" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="conquistas" className="text-xs">
              Conquistas
            </TabsTrigger>
            <TabsTrigger value="desafios" className="text-xs">
              Desafios
            </TabsTrigger>
            <TabsTrigger value="rankings" className="text-xs">
              Rankings
            </TabsTrigger>
            <TabsTrigger value="especiais" className="text-xs">
              Especiais
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <AnimatePresence mode="wait">
              {Object.entries(badgesByCategory).map(([category, categoryBadges]) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid grid-cols-3 gap-3">
                    {categoryBadges.map(renderBadge)}
                  </div>
                  {categoryBadges.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum badge nesta categoria
                    </div>
                  )}
                </TabsContent>
              ))}
            </AnimatePresence>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
