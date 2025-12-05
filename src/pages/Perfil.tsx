import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { PremiumBadge } from '@/components/ui/PremiumBadge';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import { 
  User, 
  Crown, 
  Camera, 
  ChevronRight, 
  LogOut,
  Settings,
  FileText,
  Bell,
  HelpCircle,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const menuItems = [
  { icon: FileText, label: 'Minha Anamnese', to: '/anamnese' },
  { icon: Camera, label: 'Minha Evolução', to: '/evolucao' },
  { icon: Bell, label: 'Notificações', to: '/notificacoes' },
  { icon: Settings, label: 'Configurações', to: '/configuracoes' },
  { icon: HelpCircle, label: 'Ajuda e Suporte', to: '/ajuda' },
  { icon: Shield, label: 'Privacidade', to: '/privacidade' },
];

export default function Perfil() {
  const { profile, isPremium, signOut } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const initials = profile?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao sair',
        description: 'Tente novamente',
      });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <AppLayout>
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="relative inline-block mb-4">
          <Avatar className="w-24 h-24 border-4 border-primary">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-accent text-primary text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <h1 className="text-xl font-bold text-foreground">{profile?.full_name || 'Usuário'}</h1>
        <p className="text-sm text-muted-foreground">{profile?.email}</p>
        <div className="mt-2">
          <PremiumBadge isPremium={isPremium} size="md" />
        </div>
      </motion.div>

      {/* Upgrade CTA (for free users) */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-4 mb-6 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Desbloqueie o Premium</h3>
              <p className="text-sm text-white/80">Planos personalizados e muito mais</p>
            </div>
            <Button 
              onClick={() => setShowUpgrade(true)}
              variant="secondary"
              className="bg-white text-amber-600 hover:bg-white/90"
            >
              Upgrade
            </Button>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-2xl font-bold text-foreground">12</p>
          <p className="text-xs text-muted-foreground">Treinos</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-2xl font-bold text-foreground">4</p>
          <p className="text-xs text-muted-foreground">Semanas</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-2xl font-bold text-foreground">-2kg</p>
          <p className="text-xs text-muted-foreground">Progresso</p>
        </div>
      </motion.div>

      {/* Menu Items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border border-border divide-y divide-border mb-6"
      >
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.to)}
              className="w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="flex-1 text-left font-medium text-foreground">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          );
        })}
      </motion.div>

      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut className="w-5 h-5 mr-2" />
          {loggingOut ? 'Saindo...' : 'Sair da conta'}
        </Button>
      </motion.div>

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
    </AppLayout>
  );
}
