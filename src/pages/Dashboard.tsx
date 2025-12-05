import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { WeeklyProgress } from '@/components/dashboard/WeeklyProgress';
import { PremiumBadge } from '@/components/ui/PremiumBadge';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dumbbell, 
  Apple, 
  CalendarCheck, 
  MessageCircle, 
  ShoppingBag,
  Lock,
  Bell
} from 'lucide-react';

export default function Dashboard() {
  const { profile, isPremium } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const initials = profile?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  // Mock data - will be replaced with real data
  const completedDays = [0, 1, 3]; // Monday, Tuesday, Thursday

  const handleLockedFeature = () => {
    setShowUpgrade(true);
  };

  return (
    <AppLayout>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 border-2 border-primary">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-accent text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">Olá,</p>
            <h1 className="font-semibold text-foreground">
              {profile?.full_name?.split(' ')[0] || 'Usuário'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PremiumBadge isPremium={isPremium} />
          <button className="relative p-2 rounded-full bg-secondary hover:bg-accent transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <div className="bg-card rounded-xl p-3 border border-border text-center">
          <p className="text-2xl font-bold text-primary">3</p>
          <p className="text-xs text-muted-foreground">Treinos</p>
        </div>
        <div className="bg-card rounded-xl p-3 border border-border text-center">
          <p className="text-2xl font-bold text-primary">1,450</p>
          <p className="text-xs text-muted-foreground">Calorias</p>
        </div>
        <div className="bg-card rounded-xl p-3 border border-border text-center">
          <p className="text-2xl font-bold text-primary">4</p>
          <p className="text-xs text-muted-foreground">Dias Streak</p>
        </div>
      </motion.div>

      {/* Menu Cards */}
      <div className="space-y-3 mb-6">
        <DashboardCard
          to="/treino"
          icon={Dumbbell}
          title="Meu Treino Hoje"
          subtitle="5 exercícios restantes"
          delay={0.15}
        />
        
        <DashboardCard
          to="/dieta"
          icon={Apple}
          title="Minha Dieta Hoje"
          subtitle="1.450 / 2.000 kcal"
          delay={0.2}
        />

        <DashboardCard
          to={isPremium ? "/checkin" : "#"}
          icon={CalendarCheck}
          title="Checkin Semanal"
          subtitle="Último: 3 dias atrás"
          delay={0.25}
          badge={!isPremium && <Lock className="w-4 h-4 text-muted-foreground" />}
          locked={!isPremium}
          onLockedClick={handleLockedFeature}
        />

        <DashboardCard
          to={isPremium ? "/chat" : "#"}
          icon={MessageCircle}
          title="Chat IA"
          subtitle="Tire suas dúvidas"
          delay={0.3}
          badge={!isPremium && <Lock className="w-4 h-4 text-muted-foreground" />}
          locked={!isPremium}
          onLockedClick={handleLockedFeature}
        />

        <DashboardCard
          to="/shopping"
          icon={ShoppingBag}
          title="Shopping"
          subtitle="Produtos exclusivos"
          delay={0.35}
        />
      </div>

      {/* Weekly Progress */}
      <WeeklyProgress completedDays={completedDays} />

      {/* Upgrade Modal */}
      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
    </AppLayout>
  );
}
