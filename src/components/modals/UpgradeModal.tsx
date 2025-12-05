import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const benefits = [
  'Plano de treino 100% personalizado',
  'Plano alimentar com suas preferências',
  'Acompanhamento semanal com IA',
  'Acesso ao chat com especialista',
  'Evolução com fotos e métricas',
];

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
            >
              <Crown className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <DialogTitle className="text-center text-xl">
            Desbloqueie o Premium
          </DialogTitle>
          <DialogDescription className="text-center">
            Tenha acesso a todas as funcionalidades e transforme seus resultados
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-sm text-foreground">{benefit}</span>
            </motion.div>
          ))}
        </div>

        <div className="space-y-3 pt-2">
          <Button className="w-full btn-primary-gradient" size="lg">
            <Sparkles className="w-4 h-4 mr-2" />
            Começar Agora
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Cancele quando quiser. Satisfação garantida.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
