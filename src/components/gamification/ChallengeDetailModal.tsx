import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Target,
  Clock,
  Trophy,
  Users,
  Swords,
  User,
  Share2,
  XCircle,
  MessageCircle,
} from 'lucide-react';
import { Desafio, AmigoFicticio } from '@/hooks/useGamification';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface ChallengeDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  desafio: Desafio | null;
  amigos: AmigoFicticio[];
  userProgress: number;
}

export function ChallengeDetailModal({
  open,
  onOpenChange,
  desafio,
  amigos,
  userProgress,
}: ChallengeDetailModalProps) {
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const { toast } = useToast();

  if (!desafio) return null;

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

  const progressPercent = (userProgress / desafio.meta_numero) * 100;

  // Generate fake activity feed
  const activityFeed = amigos.slice(0, 5).map((amigo, index) => ({
    id: index,
    nome: amigo.nome,
    avatar: amigo.avatar_iniciais,
    avatarCor: amigo.avatar_cor,
    acao: index % 2 === 0 ? 'completou treino' : 'bateu dieta',
    pontos: index % 2 === 0 ? 100 : 50,
    tempo: `${(index + 1) * 2}h atrás`,
  }));

  const handleShare = () => {
    toast({
      title: 'Link copiado!',
      description: 'Compartilhe com seus amigos.',
    });
  };

  const handleQuit = () => {
    setShowQuitDialog(false);
    onOpenChange(false);
    toast({
      title: 'Você saiu do desafio',
      description: 'Que pena! Tente novamente na próxima.',
    });
  };

  const handleChat = () => {
    toast({
      title: 'Em breve!',
      description: 'Chat de grupo chegando em breve.',
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {desafio.nome}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1">
            <div className="space-y-6 pr-4">
              {/* Header info */}
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={cn('text-sm', getTipoBadgeColor(desafio.tipo))}
                >
                  {getTipoIcon(desafio.tipo)}
                  <span className="ml-1 capitalize">{desafio.tipo}</span>
                </Badge>

                {desafio.fim && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {formatDistanceToNow(new Date(desafio.fim), {
                      locale: ptBR,
                      addSuffix: false,
                    })}
                  </div>
                )}
              </div>

              {/* Progress section */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Seu progresso</span>
                  <span className="font-bold">
                    {userProgress}/{desafio.meta_numero}
                  </span>
                </div>
                <Progress value={progressPercent} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  {desafio.meta === 'treinos_completos' && 'treinos completos'}
                  {desafio.meta === 'pontos_acumulados' && 'pontos acumulados'}
                  {desafio.meta === 'dieta_perfeita' && 'dias de dieta perfeita'}
                  {desafio.meta === 'checkins' && 'checkins realizados'}
                </p>
              </div>

              {/* Versus comparison */}
              {desafio.tipo === 'versus' && (
                <div className="bg-card rounded-xl border p-4">
                  <h4 className="text-sm font-semibold mb-4 text-center">
                    Placar
                  </h4>
                  <div className="flex items-center justify-around">
                    <div className="text-center">
                      <Avatar className="w-14 h-14 mx-auto mb-2">
                        <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                          EU
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-bold">{userProgress}</p>
                      <p className="text-xs text-muted-foreground">Você</p>
                    </div>
                    <div className="text-2xl font-bold text-muted-foreground">
                      VS
                    </div>
                    <div className="text-center">
                      <Avatar className="w-14 h-14 mx-auto mb-2">
                        <AvatarFallback
                          style={{ backgroundColor: amigos[0]?.avatar_cor }}
                          className="text-white font-bold"
                        >
                          {amigos[0]?.avatar_iniciais}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-bold">{Math.floor(Math.random() * desafio.meta_numero)}</p>
                      <p className="text-xs text-muted-foreground">
                        {amigos[0]?.nome}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Group participants */}
              {desafio.tipo === 'grupo' && (
                <div className="bg-card rounded-xl border p-4">
                  <h4 className="text-sm font-semibold mb-3">Participantes</h4>
                  <div className="space-y-2">
                    {amigos.slice(0, 5).map((amigo, index) => (
                      <div
                        key={amigo.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-5 text-muted-foreground">
                          #{index + 1}
                        </span>
                        <Avatar className="w-8 h-8">
                          <AvatarFallback
                            style={{ backgroundColor: amigo.avatar_cor }}
                            className="text-white text-xs"
                          >
                            {amigo.avatar_iniciais}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 truncate">{amigo.nome}</span>
                        <span className="font-medium">
                          {Math.floor(Math.random() * desafio.meta_numero)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity feed */}
              {desafio.tipo !== 'individual' && (
                <div>
                  <h4 className="text-sm font-semibold mb-3">Atividade Recente</h4>
                  <div className="space-y-2">
                    {activityFeed.map((activity) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarFallback
                            style={{ backgroundColor: activity.avatarCor }}
                            className="text-white text-xs"
                          >
                            {activity.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1">
                          <span className="font-medium">{activity.nome}</span>{' '}
                          {activity.acao}
                        </span>
                        <span className="text-primary text-xs font-medium">
                          +{activity.pontos}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {activity.tempo}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reward */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Trophy className="w-8 h-8 text-amber-500" />
                <div>
                  <p className="font-semibold text-amber-600">Recompensa</p>
                  <p className="text-sm text-muted-foreground">
                    +{desafio.recompensa_pontos} pontos ao completar
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Action buttons */}
          <div className="flex gap-2 mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuitDialog(true)}
              className="text-destructive hover:text-destructive"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Desistir
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-1" />
              Compartilhar
            </Button>
            {desafio.tipo === 'grupo' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleChat}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Chat
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Quit confirmation dialog */}
      <AlertDialog open={showQuitDialog} onOpenChange={setShowQuitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desistir do desafio?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desistir? Você perderá todo o progresso
              acumulado neste desafio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleQuit}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Desistir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
