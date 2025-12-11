import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Users, Search, UserPlus, Swords } from 'lucide-react';
import { AmigoFicticio } from '@/hooks/useGamification';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FriendsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amigos: AmigoFicticio[];
  onChallenge: (amigo: AmigoFicticio) => void;
}

export function FriendsModal({
  open,
  onOpenChange,
  amigos,
  onChallenge,
}: FriendsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const filteredAmigos = amigos.filter((a) =>
    a.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFriends = () => {
    toast({
      title: 'Em breve!',
      description: 'Integração com contatos chegando em breve.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Meus Amigos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar amigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddFriends}
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Em breve: integração com contatos
              </TooltipContent>
            </Tooltip>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {filteredAmigos.map((amigo, index) => (
                <motion.div
                  key={amigo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback
                        style={{ backgroundColor: amigo.avatar_cor }}
                        className="text-white font-semibold"
                      >
                        {amigo.avatar_iniciais}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background',
                        amigo.online ? 'bg-green-500' : 'bg-gray-400'
                      )}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{amigo.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      Nível {amigo.nivel} • {amigo.pontos.toLocaleString()} pts
                    </p>
                    {amigo.ultimo_treino && (
                      <p className="text-xs text-muted-foreground">
                        Último treino:{' '}
                        {formatDistanceToNow(new Date(amigo.ultimo_treino), {
                          locale: ptBR,
                          addSuffix: true,
                        })}
                      </p>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onChallenge(amigo)}
                    className="shrink-0"
                  >
                    <Swords className="w-4 h-4 mr-1" />
                    Desafiar
                  </Button>
                </motion.div>
              ))}

              {filteredAmigos.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum amigo encontrado
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
