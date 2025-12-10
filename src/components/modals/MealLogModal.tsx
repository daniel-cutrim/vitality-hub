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
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { usePhotoUpload } from '@/hooks/usePhotoUpload';
import { Camera, X, Loader2, Check, Plus, Minus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MealLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meal: {
    id: number;
    type: string;
    foods: string[];
    calories: number;
    macros: { p: number; c: number; g: number };
  };
  onSuccess?: () => void;
}

export function MealLogModal({ open, onOpenChange, meal, onSuccess }: MealLogModalProps) {
  const { user } = useAuth();
  const { uploadPhoto, uploading } = usePhotoUpload();
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [customCalories, setCustomCalories] = useState(meal.calories);
  const [customMacros, setCustomMacros] = useState(meal.macros);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async () => {
    if (!user) return;

    setSaving(true);
    try {
      let photoUrl: string | null = null;

      if (photo) {
        const result = await uploadPhoto(photo, user.id, 'checkin');
        if (result) {
          photoUrl = result.url;
        }
      }

      const { error } = await supabase.from('checkin_dieta').insert({
        user_id: user.id,
        refeicao: meal.type,
        calorias: customCalories,
        macros_json: customMacros,
        foto_url: photoUrl,
        data: new Date().toISOString().split('T')[0],
      });

      if (error) throw error;

      toast({
        title: 'Refeição registrada!',
        description: `${meal.type} foi salvo com sucesso.`,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error logging meal:', error);
      toast({
        title: 'Erro ao registrar',
        description: 'Não foi possível salvar a refeição.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const adjustValue = (field: 'calories' | 'p' | 'c' | 'g', delta: number) => {
    if (field === 'calories') {
      setCustomCalories((prev) => Math.max(0, prev + delta));
    } else {
      setCustomMacros((prev) => ({
        ...prev,
        [field]: Math.max(0, prev[field] + delta),
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Registrar {meal.type}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Foods List */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <Label className="text-sm font-medium text-muted-foreground mb-2 block">
              Alimentos planejados
            </Label>
            <div className="flex flex-wrap gap-2">
              {meal.foods.map((food, i) => (
                <span
                  key={i}
                  className="text-sm px-3 py-1.5 bg-background rounded-full border border-border"
                >
                  {food}
                </span>
              ))}
            </div>
          </div>

          {/* Adjustable Calories */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Calorias consumidas</Label>
            <div className="flex items-center justify-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => adjustValue('calories', -50)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="text-center">
                <span className="text-3xl font-bold text-primary">
                  {customCalories}
                </span>
                <span className="text-muted-foreground ml-1">kcal</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => adjustValue('calories', 50)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Adjustable Macros */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'p' as const, label: 'Proteína', color: 'text-blue-500' },
              { key: 'c' as const, label: 'Carboidrato', color: 'text-amber-500' },
              { key: 'g' as const, label: 'Gordura', color: 'text-rose-500' },
            ].map(({ key, label, color }) => (
              <div key={key} className="text-center space-y-2">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <div className="flex items-center justify-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => adjustValue(key, -5)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className={`text-lg font-semibold ${color}`}>
                    {customMacros[key]}g
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => adjustValue(key, 5)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Photo Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Foto da refeição (opcional)</Label>
            
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={removePhoto}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Toque para adicionar foto
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="w-full h-12"
          >
            {saving || uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Registrar Refeição
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
