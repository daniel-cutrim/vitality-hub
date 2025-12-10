import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Target, 
  Dumbbell,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  muscleGroup: string;
}

interface WorkoutDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workout: {
    id: number;
    day: string;
    name: string;
    muscles: string;
    exercises: number;
    duration: string;
  } | null;
  onStartWorkout: () => void;
}

const mockExercisesByWorkout: Record<string, Exercise[]> = {
  'Treino A': [
    { name: 'Supino Reto com Barra', sets: 4, reps: '8-12', muscleGroup: 'Peito' },
    { name: 'Supino Inclinado com Halteres', sets: 3, reps: '10-12', muscleGroup: 'Peito Superior' },
    { name: 'Crucifixo na Máquina', sets: 3, reps: '12-15', muscleGroup: 'Peito' },
    { name: 'Tríceps Pulley', sets: 3, reps: '12-15', muscleGroup: 'Tríceps' },
    { name: 'Tríceps Francês', sets: 3, reps: '10-12', muscleGroup: 'Tríceps' },
    { name: 'Mergulho no Banco', sets: 3, reps: '10-15', muscleGroup: 'Tríceps' },
  ],
  'Treino B': [
    { name: 'Puxada Frontal', sets: 4, reps: '8-12', muscleGroup: 'Costas' },
    { name: 'Remada Curvada', sets: 3, reps: '10-12', muscleGroup: 'Costas' },
    { name: 'Remada Unilateral', sets: 3, reps: '10-12', muscleGroup: 'Costas' },
    { name: 'Rosca Direta', sets: 3, reps: '10-12', muscleGroup: 'Bíceps' },
    { name: 'Rosca Martelo', sets: 3, reps: '12-15', muscleGroup: 'Bíceps' },
    { name: 'Rosca Concentrada', sets: 3, reps: '12-15', muscleGroup: 'Bíceps' },
  ],
  'Treino C': [
    { name: 'Agachamento Livre', sets: 4, reps: '8-12', muscleGroup: 'Quadríceps' },
    { name: 'Leg Press 45°', sets: 4, reps: '10-15', muscleGroup: 'Quadríceps' },
    { name: 'Cadeira Extensora', sets: 3, reps: '12-15', muscleGroup: 'Quadríceps' },
    { name: 'Mesa Flexora', sets: 3, reps: '10-12', muscleGroup: 'Posterior' },
    { name: 'Stiff', sets: 3, reps: '10-12', muscleGroup: 'Posterior/Glúteos' },
    { name: 'Elevação Pélvica', sets: 3, reps: '15-20', muscleGroup: 'Glúteos' },
    { name: 'Panturrilha em Pé', sets: 4, reps: '15-20', muscleGroup: 'Panturrilha' },
  ],
  'Treino D': [
    { name: 'Desenvolvimento com Halteres', sets: 4, reps: '8-12', muscleGroup: 'Ombro' },
    { name: 'Elevação Lateral', sets: 3, reps: '12-15', muscleGroup: 'Ombro Lateral' },
    { name: 'Elevação Frontal', sets: 3, reps: '12-15', muscleGroup: 'Ombro Frontal' },
    { name: 'Face Pull', sets: 3, reps: '15-20', muscleGroup: 'Ombro Posterior' },
    { name: 'Prancha', sets: 3, reps: '30-60s', muscleGroup: 'Core' },
  ],
};

export function WorkoutDetailModal({ 
  open, 
  onOpenChange, 
  workout, 
  onStartWorkout 
}: WorkoutDetailModalProps) {
  const navigate = useNavigate();

  if (!workout) return null;

  const exercises = mockExercisesByWorkout[workout.name] || [];
  const isRest = workout.exercises === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
              {workout.day}
            </span>
          </div>
          <DialogTitle className="text-xl font-bold">
            {workout.name}
          </DialogTitle>
          <p className="text-muted-foreground">{workout.muscles}</p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isRest && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <Target className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{workout.exercises}</p>
                  <p className="text-xs text-muted-foreground">Exercícios</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{workout.duration}</p>
                  <p className="text-xs text-muted-foreground">Duração</p>
                </div>
              </div>

              {/* Exercise List */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground text-sm">Exercícios</h3>
                <div className="space-y-2">
                  {exercises.map((exercise, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 bg-card rounded-lg border border-border p-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {exercise.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {exercise.sets} séries · {exercise.reps} reps
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">
                        {exercise.muscleGroup}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <Button 
                onClick={onStartWorkout}
                className="w-full h-12 btn-primary-gradient"
              >
                <Play className="w-5 h-5 mr-2" />
                Iniciar Treino
              </Button>
            </>
          )}

          {isRest && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Dia de Descanso</h3>
              <p className="text-muted-foreground text-sm">
                Aproveite para descansar e recuperar seus músculos. 
                O descanso é essencial para o crescimento muscular!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
