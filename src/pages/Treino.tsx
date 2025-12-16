import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useCustomWorkouts } from '@/hooks/useCustomWorkouts';
import { 
  Dumbbell, 
  ChevronRight, 
  Play, 
  Clock, 
  CheckCircle2,
  Target,
  Lock,
  Calendar,
  Edit3,
  Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import { WorkoutDetailModal } from '@/components/modals/WorkoutDetailModal';
import { EditWorkoutModal, type CustomWorkout } from '@/components/modals/EditWorkoutModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const DAYS_MAP = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function Treino() {
  const { isPremium, user } = useAuth();
  const navigate = useNavigate();
  const { workouts, isLoading, updateWorkout, getDayLabel } = useCustomWorkouts();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<CustomWorkout | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<CustomWorkout | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  const fetchCompletedWorkouts = async () => {
    if (!user) return;
    
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    const startDate = startOfWeek.toISOString().split('T')[0];
    
    const { data } = await supabase
      .from('checkin_treino')
      .select('data')
      .eq('user_id', user.id)
      .gte('data', startDate)
      .eq('treino_completo', true);
    
    if (data) {
      const days = data.map(d => {
        const date = new Date(d.data!);
        const dayIndex = date.getDay();
        const adjustedDay = dayIndex === 0 ? 6 : dayIndex - 1;
        return DAYS_MAP[adjustedDay];
      }).filter(Boolean);
      setCompletedDays(days);
    }
  };

  useEffect(() => {
    fetchCompletedWorkouts();
  }, [user]);

  const workoutsWithStatus = workouts.map((workout, index) => ({
    ...workout,
    day: getDayLabel(workout.dayOfWeek),
    completed: completedDays.includes(getDayLabel(workout.dayOfWeek)) && index < adjustedToday
  }));

  const handleStartWorkout = (workout: CustomWorkout & { day: string }) => {
    if (!isPremium) {
      setShowUpgrade(true);
      return;
    }
    setSelectedWorkout(null);
    navigate(`/treino/execucao/${workout.dayOfWeek + 1}`);
  };

  const handleWorkoutClick = (workout: CustomWorkout & { day: string }) => {
    if (isEditMode) {
      setEditingWorkout(workout);
      setShowEditModal(true);
    } else {
      setSelectedWorkout(workout);
    }
  };

  const handleSaveWorkout = async (updatedWorkout: CustomWorkout) => {
    await updateWorkout(updatedWorkout);
    setShowEditModal(false);
    setEditingWorkout(null);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Plano de Treino</h1>
            <p className="text-muted-foreground">Sua semana de treinos</p>
          </div>
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
            className={cn(
              isEditMode && "btn-primary-gradient"
            )}
          >
            {isEditMode ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Concluir
              </>
            ) : (
              <>
                <Settings2 className="w-4 h-4 mr-1" />
                Personalizar
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Modo de Edição</p>
              <p className="text-sm text-muted-foreground">Toque em um dia para editar o treino</p>
            </div>
          </div>
        </motion.div>
      )}

      {!isPremium && !isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-amber-900">Plano Genérico</p>
              <p className="text-sm text-amber-700">Faça upgrade para um plano personalizado</p>
            </div>
            <Button 
              size="sm" 
              onClick={() => setShowUpgrade(true)}
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0"
            >
              Upgrade
            </Button>
          </div>
        </motion.div>
      )}

      {/* Week Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border p-4 mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">Progresso Semanal</span>
        </div>
        <div className="flex gap-1">
          {workoutsWithStatus.map((workout, index) => {
            const isToday = index === adjustedToday;
            const isRest = workout.isRest;
            
            return (
              <div
                key={workout.id}
                className={cn(
                  "flex-1 h-2 rounded-full transition-all",
                  workout.completed 
                    ? "bg-primary" 
                    : isToday
                      ? "bg-primary/40"
                      : isRest
                        ? "bg-secondary"
                        : "bg-border"
                )}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">Seg</span>
          <span className="text-xs text-muted-foreground">Dom</span>
        </div>
      </motion.div>

      <div className="space-y-3">
        {workoutsWithStatus.map((workout, index) => {
          const isToday = index === adjustedToday;
          const isRest = workout.isRest;
          const exerciseCount = workout.exercises?.length || 0;

          return (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleWorkoutClick(workout)}
              className={cn(
                "bg-card rounded-xl border p-4 transition-all cursor-pointer active:scale-[0.98]",
                isToday ? "border-primary shadow-md" : "border-border",
                workout.completed && !isToday && "opacity-60",
                isEditMode && "ring-2 ring-primary/20 hover:ring-primary/40"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                  workout.completed 
                    ? "bg-primary/10" 
                    : isRest 
                      ? "bg-secondary" 
                      : "bg-accent"
                )}>
                  {isEditMode ? (
                    <Edit3 className="w-5 h-5 text-primary" />
                  ) : workout.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : isRest ? (
                    <Clock className="w-6 h-6 text-muted-foreground" />
                  ) : (
                    <Dumbbell className="w-6 h-6 text-primary" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      isToday 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-muted-foreground"
                    )}>
                      {workout.day}
                    </span>
                    {isToday && !isEditMode && (
                      <span className="text-xs text-primary font-medium">Hoje</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground mt-1">{workout.name}</h3>
                  <p className="text-sm text-muted-foreground">{workout.muscles}</p>
                </div>

                {!isRest && !workout.completed && !isEditMode && (
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Target className="w-4 h-4" />
                      {exerciseCount} ex
                    </div>
                    {isToday && (
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartWorkout(workout);
                        }}
                        className="btn-primary-gradient"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Iniciar
                      </Button>
                    )}
                  </div>
                )}

                {!isEditMode && (isRest || workout.completed || (!isToday && !workout.completed)) && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}

                {isEditMode && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-primary font-medium">Editar</span>
                    <ChevronRight className="w-5 h-5 text-primary" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
      
      <WorkoutDetailModal
        open={!!selectedWorkout && !isEditMode}
        onOpenChange={(open) => !open && setSelectedWorkout(null)}
        workout={selectedWorkout ? {
          id: selectedWorkout.dayOfWeek + 1,
          day: getDayLabel(selectedWorkout.dayOfWeek),
          name: selectedWorkout.name,
          muscles: selectedWorkout.muscles,
          exercises: selectedWorkout.exercises?.length || 0,
          duration: `${Math.round((selectedWorkout.exercises?.length || 0) * 5)} min`,
        } : null}
        onStartWorkout={() => selectedWorkout && handleStartWorkout({
          ...selectedWorkout,
          day: getDayLabel(selectedWorkout.dayOfWeek)
        })}
      />

      <EditWorkoutModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        workout={editingWorkout}
        onSave={handleSaveWorkout}
      />
    </AppLayout>
  );
}
