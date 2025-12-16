import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';
import type { CustomWorkout, WorkoutExercise } from '@/components/modals/EditWorkoutModal';

const DEFAULT_WORKOUTS: CustomWorkout[] = [
  { 
    id: '1', 
    dayOfWeek: 0, 
    name: 'Treino A', 
    muscles: 'Peito + Tríceps', 
    isRest: false,
    exercises: [
      { id: '1a', name: 'Supino Reto com Barra', sets: 4, reps: '8-12', restSeconds: 90, muscleGroup: 'Peito' },
      { id: '1b', name: 'Supino Inclinado com Halteres', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Peito' },
      { id: '1c', name: 'Crucifixo na Máquina', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'Peito' },
      { id: '1d', name: 'Tríceps Pulley', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'Tríceps' },
      { id: '1e', name: 'Tríceps Francês', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Tríceps' },
      { id: '1f', name: 'Mergulho no Banco', sets: 3, reps: '10-15', restSeconds: 60, muscleGroup: 'Tríceps' },
    ]
  },
  { 
    id: '2', 
    dayOfWeek: 1, 
    name: 'Treino B', 
    muscles: 'Costas + Bíceps', 
    isRest: false,
    exercises: [
      { id: '2a', name: 'Puxada Frontal', sets: 4, reps: '8-12', restSeconds: 90, muscleGroup: 'Costas' },
      { id: '2b', name: 'Remada Curvada', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Costas' },
      { id: '2c', name: 'Remada Unilateral', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Costas' },
      { id: '2d', name: 'Rosca Direta', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Bíceps' },
      { id: '2e', name: 'Rosca Martelo', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'Bíceps' },
      { id: '2f', name: 'Rosca Concentrada', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'Bíceps' },
    ]
  },
  { id: '3', dayOfWeek: 2, name: 'Descanso', muscles: 'Recuperação', isRest: true, exercises: [] },
  { 
    id: '4', 
    dayOfWeek: 3, 
    name: 'Treino C', 
    muscles: 'Pernas + Glúteos', 
    isRest: false,
    exercises: [
      { id: '4a', name: 'Agachamento Livre', sets: 4, reps: '8-12', restSeconds: 120, muscleGroup: 'Quadríceps' },
      { id: '4b', name: 'Leg Press 45°', sets: 4, reps: '10-15', restSeconds: 90, muscleGroup: 'Quadríceps' },
      { id: '4c', name: 'Cadeira Extensora', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'Quadríceps' },
      { id: '4d', name: 'Mesa Flexora', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Posterior' },
      { id: '4e', name: 'Stiff', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Glúteos' },
      { id: '4f', name: 'Elevação Pélvica', sets: 3, reps: '15-20', restSeconds: 60, muscleGroup: 'Glúteos' },
      { id: '4g', name: 'Panturrilha em Pé', sets: 4, reps: '15-20', restSeconds: 45, muscleGroup: 'Panturrilha' },
    ]
  },
  { 
    id: '5', 
    dayOfWeek: 4, 
    name: 'Treino A', 
    muscles: 'Peito + Tríceps', 
    isRest: false,
    exercises: [
      { id: '5a', name: 'Supino Reto com Barra', sets: 4, reps: '8-12', restSeconds: 90, muscleGroup: 'Peito' },
      { id: '5b', name: 'Supino Inclinado com Halteres', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Peito' },
      { id: '5c', name: 'Crucifixo na Máquina', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'Peito' },
      { id: '5d', name: 'Tríceps Pulley', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'Tríceps' },
      { id: '5e', name: 'Tríceps Francês', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Tríceps' },
      { id: '5f', name: 'Mergulho no Banco', sets: 3, reps: '10-15', restSeconds: 60, muscleGroup: 'Tríceps' },
    ]
  },
  { 
    id: '6', 
    dayOfWeek: 5, 
    name: 'Treino D', 
    muscles: 'Ombros + Core', 
    isRest: false,
    exercises: [
      { id: '6a', name: 'Desenvolvimento com Halteres', sets: 4, reps: '8-12', restSeconds: 90, muscleGroup: 'Ombros' },
      { id: '6b', name: 'Elevação Lateral', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'Ombros' },
      { id: '6c', name: 'Elevação Frontal', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'Ombros' },
      { id: '6d', name: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60, muscleGroup: 'Ombros' },
      { id: '6e', name: 'Prancha', sets: 3, reps: '30-60s', restSeconds: 45, muscleGroup: 'Core' },
    ]
  },
  { id: '7', dayOfWeek: 6, name: 'Descanso', muscles: 'Recuperação', isRest: true, exercises: [] },
];

const DAYS_MAP = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export function useCustomWorkouts() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<CustomWorkout[]>(DEFAULT_WORKOUTS);
  const [isLoading, setIsLoading] = useState(true);

  const loadWorkouts = useCallback(async () => {
    if (!user) {
      setWorkouts(DEFAULT_WORKOUTS);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('planos_treino')
        .select('*')
        .eq('user_id', user.id)
        .eq('ativo', true)
        .maybeSingle();

      if (error) throw error;

      if (data?.plano_json) {
        const savedWorkouts = data.plano_json as unknown as CustomWorkout[];
        if (Array.isArray(savedWorkouts) && savedWorkouts.length > 0) {
          setWorkouts(savedWorkouts);
        }
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  const saveWorkouts = async (newWorkouts: CustomWorkout[]) => {
    if (!user) {
      toast.error('Você precisa estar logado para salvar');
      return false;
    }

    try {
      // Check if there's an existing plan
      const { data: existing } = await supabase
        .from('planos_treino')
        .select('id')
        .eq('user_id', user.id)
        .eq('ativo', true)
        .maybeSingle();

      if (existing) {
        // Update existing plan
        const { error } = await supabase
          .from('planos_treino')
          .update({ 
            plano_json: newWorkouts as unknown as Json,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new plan
        const { error } = await supabase
          .from('planos_treino')
          .insert([{
            user_id: user.id,
            plano_json: newWorkouts as unknown as Json,
            ativo: true
          }]);

        if (error) throw error;
      }

      setWorkouts(newWorkouts);
      return true;
    } catch (error) {
      console.error('Error saving workouts:', error);
      toast.error('Erro ao salvar treino');
      return false;
    }
  };

  const updateWorkout = async (updatedWorkout: CustomWorkout) => {
    const newWorkouts = workouts.map(w => 
      w.dayOfWeek === updatedWorkout.dayOfWeek ? updatedWorkout : w
    );
    return saveWorkouts(newWorkouts);
  };

  const getDayLabel = (dayOfWeek: number) => DAYS_MAP[dayOfWeek] || '';

  const getWorkoutByDay = (dayOfWeek: number) => {
    return workouts.find(w => w.dayOfWeek === dayOfWeek);
  };

  return {
    workouts,
    isLoading,
    saveWorkouts,
    updateWorkout,
    getDayLabel,
    getWorkoutByDay,
    reload: loadWorkouts,
  };
}
