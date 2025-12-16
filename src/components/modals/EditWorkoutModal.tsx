import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Trash2, 
  GripVertical,
  Dumbbell,
  Save,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  muscleGroup: string;
}

export interface CustomWorkout {
  id: string;
  dayOfWeek: number;
  name: string;
  muscles: string;
  exercises: WorkoutExercise[];
  isRest: boolean;
}

interface EditWorkoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workout: CustomWorkout | null;
  onSave: (workout: CustomWorkout) => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Segunda' },
  { value: 1, label: 'Terça' },
  { value: 2, label: 'Quarta' },
  { value: 3, label: 'Quinta' },
  { value: 4, label: 'Sexta' },
  { value: 5, label: 'Sábado' },
  { value: 6, label: 'Domingo' },
];

const MUSCLE_GROUPS = [
  'Peito',
  'Costas',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Quadríceps',
  'Posterior',
  'Glúteos',
  'Panturrilha',
  'Core',
  'Cardio',
];

const COMMON_EXERCISES = [
  'Supino Reto',
  'Supino Inclinado',
  'Crucifixo',
  'Puxada Frontal',
  'Remada Curvada',
  'Remada Unilateral',
  'Desenvolvimento',
  'Elevação Lateral',
  'Elevação Frontal',
  'Rosca Direta',
  'Rosca Martelo',
  'Tríceps Pulley',
  'Tríceps Francês',
  'Agachamento',
  'Leg Press',
  'Cadeira Extensora',
  'Mesa Flexora',
  'Stiff',
  'Elevação Pélvica',
  'Panturrilha',
  'Prancha',
  'Abdominal',
];

export function EditWorkoutModal({ 
  open, 
  onOpenChange, 
  workout,
  onSave 
}: EditWorkoutModalProps) {
  const [name, setName] = useState('');
  const [muscles, setMuscles] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [isRest, setIsRest] = useState(false);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

  useEffect(() => {
    if (workout) {
      setName(workout.name);
      setMuscles(workout.muscles);
      setDayOfWeek(workout.dayOfWeek);
      setIsRest(workout.isRest);
      setExercises(workout.exercises || []);
    } else {
      resetForm();
    }
  }, [workout, open]);

  const resetForm = () => {
    setName('Treino Novo');
    setMuscles('');
    setDayOfWeek(0);
    setIsRest(false);
    setExercises([]);
  };

  const addExercise = () => {
    const newExercise: WorkoutExercise = {
      id: crypto.randomUUID(),
      name: '',
      sets: 3,
      reps: '12',
      restSeconds: 60,
      muscleGroup: '',
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (id: string, updates: Partial<WorkoutExercise>) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, ...updates } : ex
    ));
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleSave = () => {
    if (!isRest && exercises.length === 0) {
      toast.error('Adicione pelo menos um exercício');
      return;
    }

    if (!name.trim()) {
      toast.error('Dê um nome ao treino');
      return;
    }

    const updatedWorkout: CustomWorkout = {
      id: workout?.id || crypto.randomUUID(),
      dayOfWeek,
      name: isRest ? 'Descanso' : name.trim(),
      muscles: isRest ? 'Recuperação' : muscles.trim(),
      exercises: isRest ? [] : exercises,
      isRest,
    };

    onSave(updatedWorkout);
    onOpenChange(false);
    toast.success('Treino salvo com sucesso!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-primary" />
            {workout ? 'Editar Treino' : 'Novo Treino'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Day Selection */}
          <div className="space-y-2">
            <Label>Dia da Semana</Label>
            <Select 
              value={dayOfWeek.toString()} 
              onValueChange={(v) => setDayOfWeek(parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day.value} value={day.value.toString()}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rest Day Toggle */}
          <div 
            onClick={() => setIsRest(!isRest)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
              isRest ? "bg-primary/10 border-primary" : "bg-card border-border"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
              isRest ? "border-primary bg-primary" : "border-muted-foreground"
            )}>
              {isRest && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <span className="font-medium">Dia de Descanso</span>
          </div>

          {!isRest && (
            <>
              {/* Workout Name */}
              <div className="space-y-2">
                <Label>Nome do Treino</Label>
                <Input 
                  placeholder="Ex: Treino A - Peito"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Muscle Groups */}
              <div className="space-y-2">
                <Label>Músculos Trabalhados</Label>
                <Input 
                  placeholder="Ex: Peito + Tríceps"
                  value={muscles}
                  onChange={(e) => setMuscles(e.target.value)}
                />
              </div>

              {/* Exercises */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Exercícios</Label>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={addExercise}
                    className="h-8"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                </div>

                <AnimatePresence>
                  {exercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-secondary/30 rounded-lg p-3 space-y-3 border border-border"
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                        <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-auto h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => removeExercise(exercise.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Exercise Name */}
                      <div className="space-y-1">
                        <Label className="text-xs">Nome do Exercício</Label>
                        <Input
                          placeholder="Ex: Supino Reto"
                          value={exercise.name}
                          onChange={(e) => updateExercise(exercise.id, { name: e.target.value })}
                          list={`exercises-${exercise.id}`}
                        />
                        <datalist id={`exercises-${exercise.id}`}>
                          {COMMON_EXERCISES.map((ex) => (
                            <option key={ex} value={ex} />
                          ))}
                        </datalist>
                      </div>

                      {/* Muscle Group */}
                      <div className="space-y-1">
                        <Label className="text-xs">Grupo Muscular</Label>
                        <Select 
                          value={exercise.muscleGroup} 
                          onValueChange={(v) => updateExercise(exercise.id, { muscleGroup: v })}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {MUSCLE_GROUPS.map((group) => (
                              <SelectItem key={group} value={group}>
                                {group}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sets, Reps, Rest */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Séries</Label>
                          <Input
                            type="number"
                            min={1}
                            max={10}
                            value={exercise.sets}
                            onChange={(e) => updateExercise(exercise.id, { sets: parseInt(e.target.value) || 1 })}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Repetições</Label>
                          <Input
                            placeholder="12"
                            value={exercise.reps}
                            onChange={(e) => updateExercise(exercise.id, { reps: e.target.value })}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Descanso (s)</Label>
                          <Input
                            type="number"
                            min={0}
                            max={300}
                            step={10}
                            value={exercise.restSeconds}
                            onChange={(e) => updateExercise(exercise.id, { restSeconds: parseInt(e.target.value) || 60 })}
                            className="h-9"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {exercises.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum exercício adicionado</p>
                    <p className="text-xs">Clique em "Adicionar" para começar</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-1" />
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              className="flex-1 btn-primary-gradient"
            >
              <Save className="w-4 h-4 mr-1" />
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
