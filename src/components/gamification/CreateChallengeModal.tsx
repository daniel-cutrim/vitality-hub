import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  User,
  Swords,
  Users,
  Dumbbell,
  TrendingUp,
  Apple,
  Calendar,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Check,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AmigoFicticio, Desafio } from '@/hooks/useGamification';

interface CreateChallengeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amigos: AmigoFicticio[];
  onCreate: (desafio: Partial<Desafio>) => Promise<any>;
}

type ChallengeType = 'individual' | 'versus' | 'grupo';
type MetaType = 'treinos_completos' | 'pontos_acumulados' | 'dieta_perfeita' | 'checkins';

const metaOptions = [
  { id: 'treinos_completos', label: 'Complete X treinos', icon: Dumbbell },
  { id: 'pontos_acumulados', label: 'Acumule X pontos', icon: TrendingUp },
  { id: 'dieta_perfeita', label: 'Dieta perfeita por X dias', icon: Apple },
  { id: 'checkins', label: 'Faça X checkins semanais', icon: Calendar },
];

const duracaoOptions = [
  { value: 7, label: '7 dias' },
  { value: 15, label: '15 dias' },
  { value: 30, label: '30 dias' },
];

export function CreateChallengeModal({
  open,
  onOpenChange,
  amigos,
  onCreate,
}: CreateChallengeModalProps) {
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState<ChallengeType>('individual');
  const [nome, setNome] = useState('');
  const [meta, setMeta] = useState<MetaType>('treinos_completos');
  const [metaNumero, setMetaNumero] = useState(10);
  const [duracao, setDuracao] = useState(7);
  const [recompensa, setRecompensa] = useState(100);
  const [participantes, setParticipantes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const totalSteps = tipo === 'individual' ? 5 : 6;

  const filteredAmigos = amigos.filter((a) =>
    a.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    if (step < totalSteps) {
      // Skip participants step for individual challenges
      if (step === 2 && tipo === 'individual') {
        setStep(4);
      } else {
        setStep(step + 1);
      }
    } else {
      handleCreate();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      if (step === 4 && tipo === 'individual') {
        setStep(2);
      } else {
        setStep(step - 1);
      }
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      await onCreate({
        tipo,
        nome: nome || `Desafio de ${metaOptions.find((m) => m.id === meta)?.label.replace('X', String(metaNumero))}`,
        meta,
        meta_numero: metaNumero,
        duracao_dias: duracao,
        recompensa_pontos: recompensa,
      });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error creating challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setTipo('individual');
    setNome('');
    setMeta('treinos_completos');
    setMetaNumero(10);
    setDuracao(7);
    setRecompensa(100);
    setParticipantes([]);
    setSearchQuery('');
  };

  const toggleParticipante = (id: string) => {
    setParticipantes((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-center mb-6">Tipo de Desafio</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'individual', label: 'Individual', icon: User, desc: 'Só você' },
                { id: 'versus', label: 'Versus', icon: Swords, desc: '1 vs 1' },
                { id: 'grupo', label: 'Grupo', icon: Users, desc: 'Até 50' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setTipo(option.id as ChallengeType)}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                    tipo === option.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <option.icon
                    className={cn(
                      'w-8 h-8',
                      tipo === option.id ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  <span className="font-medium text-sm">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.desc}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-center mb-6">Definir Meta</h3>
            <div className="space-y-3">
              {metaOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setMeta(option.id as MetaType)}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3',
                    meta === option.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <option.icon
                    className={cn(
                      'w-6 h-6',
                      meta === option.id ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
            <div className="pt-4">
              <Label>Quantidade: {metaNumero}</Label>
              <Slider
                value={[metaNumero]}
                onValueChange={([v]) => setMetaNumero(v)}
                min={1}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-center mb-4">Escolher Participantes</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar amigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {participantes.length}/{tipo === 'versus' ? 1 : 50} selecionados
            </p>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {filteredAmigos.map((amigo) => (
                  <button
                    key={amigo.id}
                    onClick={() => toggleParticipante(amigo.id)}
                    disabled={
                      tipo === 'versus' &&
                      participantes.length >= 1 &&
                      !participantes.includes(amigo.id)
                    }
                    className={cn(
                      'w-full p-3 rounded-lg border flex items-center gap-3 transition-all',
                      participantes.includes(amigo.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50',
                      tipo === 'versus' &&
                        participantes.length >= 1 &&
                        !participantes.includes(amigo.id) &&
                        'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <Checkbox checked={participantes.includes(amigo.id)} />
                    <Avatar className="w-10 h-10">
                      <AvatarFallback
                        style={{ backgroundColor: amigo.avatar_cor }}
                        className="text-white text-sm"
                      >
                        {amigo.avatar_iniciais}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{amigo.nome}</p>
                      <p className="text-xs text-muted-foreground">Nível {amigo.nivel}</p>
                    </div>
                    {amigo.online && (
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-center mb-6">Duração</h3>
            <div className="grid grid-cols-3 gap-3">
              {duracaoOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDuracao(option.value)}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all',
                    duracao === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-center mb-6">Recompensa</h3>
            <div className="text-center py-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
              <Trophy className="w-12 h-12 mx-auto text-primary mb-2" />
              <p className="text-3xl font-bold text-primary">+{recompensa} pts</p>
            </div>
            <div>
              <Label>Pontos de recompensa: {recompensa}</Label>
              <Slider
                value={[recompensa]}
                onValueChange={([v]) => setRecompensa(v)}
                min={50}
                max={500}
                step={50}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-center mb-6">Revisar e Confirmar</h3>
            <div className="space-y-3 bg-muted/50 rounded-xl p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo</span>
                <span className="font-medium capitalize">{tipo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Meta</span>
                <span className="font-medium">
                  {metaOptions.find((m) => m.id === meta)?.label.replace('X', String(metaNumero))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duração</span>
                <span className="font-medium">{duracao} dias</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recompensa</span>
                <span className="font-medium text-primary">+{recompensa} pts</span>
              </div>
              {participantes.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Participantes</span>
                  <span className="font-medium">{participantes.length}</span>
                </div>
              )}
            </div>
            <Input
              placeholder="Nome do desafio (opcional)"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Desafio</DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                i < step ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Voltar
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={loading}
            className="flex-1 btn-primary-gradient"
          >
            {step === totalSteps ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Criar
              </>
            ) : (
              <>
                Próximo
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
