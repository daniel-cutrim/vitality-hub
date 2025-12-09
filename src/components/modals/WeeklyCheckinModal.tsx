import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePhotoUpload } from '@/hooks/usePhotoUpload';
import { Camera, X, Loader2, CheckCircle } from 'lucide-react';

interface WeeklyCheckinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emojis = [
  { value: 1, emoji: '😢', label: 'Muito mal' },
  { value: 2, emoji: '😔', label: 'Mal' },
  { value: 3, emoji: '😐', label: 'Normal' },
  { value: 4, emoji: '😊', label: 'Bem' },
  { value: 5, emoji: '🤩', label: 'Excelente' },
];

export function WeeklyCheckinModal({ open, onOpenChange }: WeeklyCheckinModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { uploadMultiplePhotos, uploading } = usePhotoUpload();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [sentimento, setSentimento] = useState<number | null>(null);
  const [comoSeSentiu, setComoSeSentiu] = useState('');
  const [dificuldades, setDificuldades] = useState('');
  const [peso, setPeso] = useState('');
  const [fotos, setFotos] = useState<File[]>([]);
  const [fotoPreviews, setFotoPreviews] = useState<string[]>([]);

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (fotos.length + files.length > 3) {
      toast({
        title: "Limite de fotos",
        description: "Você pode enviar no máximo 3 fotos.",
        variant: "destructive",
      });
      return;
    }

    const newFotos = [...fotos, ...files].slice(0, 3);
    setFotos(newFotos);

    // Create previews
    const newPreviews = newFotos.map(file => URL.createObjectURL(file));
    setFotoPreviews(newPreviews);
  };

  const removeFoto = (index: number) => {
    const newFotos = fotos.filter((_, i) => i !== index);
    const newPreviews = fotoPreviews.filter((_, i) => i !== index);
    setFotos(newFotos);
    setFotoPreviews(newPreviews);
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Upload photos if any
      let photoUrls: string[] = [];
      if (fotos.length > 0) {
        photoUrls = await uploadMultiplePhotos(fotos, user.id, 'checkin');
      }

      // Get start of current week (Monday)
      const now = new Date();
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const weekStart = new Date(now.setDate(diff));
      weekStart.setHours(0, 0, 0, 0);

      const { error } = await supabase
        .from('checkin_semanal')
        .insert({
          user_id: user.id,
          semana_inicio: weekStart.toISOString().split('T')[0],
          sentimento,
          dificuldades: `Como me senti: ${comoSeSentiu}\n\nDificuldades: ${dificuldades}`,
          peso_atual: peso ? parseFloat(peso) : null,
          fotos_evolucao: photoUrls,
        });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        onOpenChange(false);
      }, 2000);

    } catch (error) {
      console.error('Error submitting checkin:', error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar seu checkin. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSentimento(null);
    setComoSeSentiu('');
    setDificuldades('');
    setPeso('');
    setFotos([]);
    setFotoPreviews([]);
    setSuccess(false);
  };

  const canProceed = () => {
    if (step === 1) return sentimento !== null;
    if (step === 2) return comoSeSentiu.trim().length > 0;
    if (step === 3) return true; // Dificuldades is optional
    if (step === 4) return true; // Weight and photos are optional
    return false;
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {success ? 'Checkin Enviado!' : 'Checkin Semanal'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-20 h-20 text-primary mb-4" />
              </motion.div>
              <p className="text-lg font-medium text-foreground">Parabéns!</p>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Seu checkin foi registrado com sucesso.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Progress indicator */}
              <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      s <= step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              {/* Step 1: Emoji Scale */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    Como você está se sentindo esta semana?
                  </p>
                  <div className="flex justify-center gap-3">
                    {emojis.map((item) => (
                      <motion.button
                        key={item.value}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSentimento(item.value)}
                        className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                          sentimento === item.value
                            ? 'bg-primary/10 ring-2 ring-primary'
                            : 'bg-secondary hover:bg-accent'
                        }`}
                      >
                        <span className="text-3xl mb-1">{item.emoji}</span>
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: How did you feel */}
              {step === 2 && (
                <div className="space-y-4">
                  <Label htmlFor="como-se-sentiu">
                    Conte-nos mais sobre como foi sua semana
                  </Label>
                  <Textarea
                    id="como-se-sentiu"
                    placeholder="Ex: Me senti bem disposto para os treinos, consegui manter a dieta na maior parte dos dias..."
                    value={comoSeSentiu}
                    onChange={(e) => setComoSeSentiu(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              )}

              {/* Step 3: Difficulties */}
              {step === 3 && (
                <div className="space-y-4">
                  <Label htmlFor="dificuldades">
                    Houve alguma dificuldade durante a semana? (opcional)
                  </Label>
                  <Textarea
                    id="dificuldades"
                    placeholder="Ex: Tive dificuldade em manter a dieta no final de semana, senti dor no joelho durante o agachamento..."
                    value={dificuldades}
                    onChange={(e) => setDificuldades(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              )}

              {/* Step 4: Weight and Photos */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso atual (kg) - opcional</Label>
                    <Input
                      id="peso"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 75.5"
                      value={peso}
                      onChange={(e) => setPeso(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Fotos da evolução (opcional)</Label>
                    <p className="text-xs text-muted-foreground">
                      Tire fotos em 3 ângulos: frente, costas e lateral
                    </p>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="relative">
                          {fotoPreviews[index] ? (
                            <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                              <img
                                src={fotoPreviews[index]}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => removeFoto(index)}
                                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center aspect-[3/4] rounded-lg border-2 border-dashed border-border bg-secondary/50 cursor-pointer hover:bg-accent transition-colors">
                              <Camera className="w-6 h-6 text-muted-foreground mb-1" />
                              <span className="text-xs text-muted-foreground">
                                {index === 0 ? 'Frente' : index === 1 ? 'Costas' : 'Lateral'}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFotoUpload}
                              />
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                )}
                
                {step < 4 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed()}
                    className="flex-1"
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || uploading}
                    className="flex-1"
                  >
                    {loading || uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {uploading ? 'Enviando fotos...' : 'Salvando...'}
                      </>
                    ) : (
                      'Enviar Checkin'
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
