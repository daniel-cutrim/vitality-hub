import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Sparkles, Star } from 'lucide-react';
import Confetti from 'react-confetti';

interface LevelUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: number | null;
  levelInfo: Record<number, { nome: string; descricao: string }>;
}

export function LevelUpModal({
  open,
  onOpenChange,
  level,
  levelInfo,
}: LevelUpModalProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (open) {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setShowConfetti(true);
      
      // Stop confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [open]);

  const info = level ? levelInfo[level] : null;

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          colors={['#10B981', '#34D399', '#6EE7B7', '#FCD34D', '#FBBF24']}
        />
      )}
      
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm text-center">
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="py-6"
              >
                {/* Animated stars */}
                <div className="relative mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {[0, 60, 120, 180, 240, 300].map((rotation) => (
                      <Star
                        key={rotation}
                        className="absolute w-4 h-4 text-amber-400 fill-amber-400"
                        style={{
                          transform: `rotate(${rotation}deg) translateY(-50px)`,
                        }}
                      />
                    ))}
                  </motion.div>
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-primary/30"
                  >
                    <Trophy className="w-12 h-12 text-white" />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-medium text-amber-500">
                      LEVEL UP!
                    </span>
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>

                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    Parabéns! 🎉
                  </h2>
                  
                  <p className="text-muted-foreground mb-4">
                    Você subiu para o nível
                  </p>

                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl p-4 mb-6">
                    <p className="text-3xl font-bold text-primary mb-1">
                      {info?.nome || 'Novo Nível'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {info?.descricao || ''}
                    </p>
                  </div>

                  <Button
                    onClick={() => onOpenChange(false)}
                    className="w-full btn-primary-gradient"
                  >
                    Continuar 💪
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
