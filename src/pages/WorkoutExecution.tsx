import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipForward, 
  Check,
  Timer,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronRight,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/hooks/useGamification';

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  videoUrl: string;
  muscleGroup: string;
  instructions: string;
}

const mockExercises: Exercise[] = [
  {
    id: 1,
    name: 'Supino Reto com Barra',
    sets: 4,
    reps: '8-12',
    restSeconds: 90,
    videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
    muscleGroup: 'Peito',
    instructions: 'Mantenha os pés firmes no chão e desça a barra até o peito.'
  },
  {
    id: 2,
    name: 'Supino Inclinado com Halteres',
    sets: 3,
    reps: '10-12',
    restSeconds: 60,
    videoUrl: 'https://www.youtube.com/embed/8iPEnn-ltC8',
    muscleGroup: 'Peito Superior',
    instructions: 'Incline o banco em 30-45 graus. Controle a descida dos halteres.'
  },
  {
    id: 3,
    name: 'Crucifixo na Máquina',
    sets: 3,
    reps: '12-15',
    restSeconds: 60,
    videoUrl: 'https://www.youtube.com/embed/Z57CtFmRMxA',
    muscleGroup: 'Peito',
    instructions: 'Foque na contração do peitoral ao juntar os braços.'
  },
  {
    id: 4,
    name: 'Tríceps Pulley',
    sets: 3,
    reps: '12-15',
    restSeconds: 60,
    videoUrl: 'https://www.youtube.com/embed/2-LAMcpzODU',
    muscleGroup: 'Tríceps',
    instructions: 'Mantenha os cotovelos fixos ao lado do corpo.'
  },
  {
    id: 5,
    name: 'Tríceps Francês',
    sets: 3,
    reps: '10-12',
    restSeconds: 60,
    videoUrl: 'https://www.youtube.com/embed/ir5PsbniVSc',
    muscleGroup: 'Tríceps',
    instructions: 'Desça o halter atrás da cabeça com controle.'
  },
  {
    id: 6,
    name: 'Mergulho no Banco',
    sets: 3,
    reps: '10-15',
    restSeconds: 60,
    videoUrl: 'https://www.youtube.com/embed/c3ZGl4pAwZ4',
    muscleGroup: 'Tríceps',
    instructions: 'Desça até os cotovelos formarem 90 graus.'
  }
];

type WorkoutPhase = 'exercise' | 'rest' | 'completed';

export default function WorkoutExecution() {
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const { addPoints, updateStreak, pontuacao, getStreakMultiplier } = useGamification();
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [phase, setPhase] = useState<WorkoutPhase>('exercise');
  const [restTime, setRestTime] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentExercise = mockExercises[currentExerciseIndex];
  const totalExercises = mockExercises.length;
  const progress = ((currentExerciseIndex + (completedSets.length / currentExercise.sets)) / totalExercises) * 100;
  const streakMultiplier = pontuacao ? getStreakMultiplier(pontuacao.streak_dias) : 1;

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleA8dcdLb3Y1YOiVg0NznpHE1BYHq//CuiVMXgvz/9sdlLiyI//r2z4FJGqr9/+nLeUoSlvb54NqNbTYU1PXv1bqGZjQa4fPl2suGZTEl9u7b2MOFXCw9+OjW2biQai9B+OPQ06KeYC1V89HUz6+pZy1p7sDSzLSqaS1+46zJxbSpbS2P1pe/vbGobC2fxoW0tLCmbC+ut3WprKmjbi+7qGihpKehczLFmluYnKWeeDLPjE2PlqOdfDXYgT+GkKCdfDngdzR/iqOdeULodih4hKOceUjwailxfqGbdFH2Xyhrd52Zb1r8UiRlc5mVbGT+Rx9fc5SNaG/+ORpZdI+IZHr7Kxd');
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Rest timer logic
  useEffect(() => {
    if (phase === 'rest' && restTime > 0 && !isTimerPaused) {
      timerRef.current = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            playSound();
            setPhase('exercise');
            return 0;
          }
          // Play sound at 3 seconds
          if (prev === 4 && soundEnabled) {
            playSound();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, isTimerPaused, soundEnabled]);

  const playSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [soundEnabled]);

  const handleCompleteSet = () => {
    const newCompletedSets = [...completedSets, currentSet];
    setCompletedSets(newCompletedSets);

    if (currentSet < currentExercise.sets) {
      // Start rest timer
      setRestTime(currentExercise.restSeconds);
      setPhase('rest');
      setCurrentSet(prev => prev + 1);
    } else {
      // Move to next exercise
      if (currentExerciseIndex < totalExercises - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
        setCompletedSets([]);
        setRestTime(currentExercise.restSeconds);
        setPhase('rest');
      } else {
        // Workout completed - add points!
        handleWorkoutComplete();
      }
    }
  };

  const handleWorkoutComplete = async () => {
    setPhase('completed');
    
    try {
      // Update streak first
      await updateStreak(true);
      
      // Add 100 points for completed workout
      const points = await addPoints('Treino Completo', 100, workoutId, 'treino');
      setEarnedPoints(points || 100);
    } catch (error) {
      console.error('Error adding workout points:', error);
    }
  };

  const handleSkipRest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRestTime(0);
    setPhase('exercise');
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setCompletedSets([]);
      setPhase('exercise');
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setCurrentSet(1);
      setCompletedSets([]);
      setPhase('exercise');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (phase === 'completed') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6"
        >
          <Check className="w-12 h-12 text-primary" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-foreground mb-2"
        >
          Treino Concluído!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-4"
        >
          Parabéns! Você completou todos os exercícios.
        </motion.p>
        
        {/* Points earned display */}
        {earnedPoints && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, type: "spring" }}
            className="bg-primary/10 border border-primary/20 rounded-xl px-6 py-4 mb-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-primary">
              <Flame className="w-5 h-5" />
              <span className="text-2xl font-bold">+{earnedPoints} pts</span>
            </div>
            {streakMultiplier > 1 && (
              <p className="text-sm text-primary/80 mt-1">
                Streak ×{streakMultiplier} ativado! 🔥
              </p>
            )}
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={() => navigate('/treino')} className="btn-primary-gradient">
            Voltar ao Plano
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/treino')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Exercício {currentExerciseIndex + 1}/{totalExercises}</p>
            <p className="font-semibold text-foreground">{currentExercise.muscleGroup}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {phase === 'rest' ? (
            <motion.div
              key="rest"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-primary/5 to-primary/10"
            >
              <Timer className="w-12 h-12 text-primary mb-4" />
              <p className="text-muted-foreground mb-2">Tempo de Descanso</p>
              <motion.div
                key={restTime}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-6xl font-bold text-primary mb-6"
              >
                {formatTime(restTime)}
              </motion.div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                >
                  {isTimerPaused ? (
                    <Play className="w-5 h-5" />
                  ) : (
                    <Pause className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setRestTime(currentExercise.restSeconds)}
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
                <Button onClick={handleSkipRest} className="btn-primary-gradient">
                  <SkipForward className="w-4 h-4 mr-2" />
                  Pular
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                Próxima: Série {currentSet} de {currentExercise.sets}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="exercise"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              {/* Video */}
              <div className="relative aspect-video bg-secondary">
                <iframe
                  src={currentExercise.videoUrl}
                  title={currentExercise.name}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Exercise Info */}
              <div className="flex-1 p-4 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{currentExercise.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{currentExercise.instructions}</p>
                </div>

                {/* Sets Counter */}
                <div className="bg-card rounded-xl border border-border p-4">
                  <p className="text-sm text-muted-foreground mb-3">Séries</p>
                  <div className="flex gap-2">
                    {Array.from({ length: currentExercise.sets }, (_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex-1 h-12 rounded-lg flex items-center justify-center font-semibold transition-all",
                          completedSets.includes(i + 1)
                            ? "bg-primary text-primary-foreground"
                            : i + 1 === currentSet
                              ? "bg-primary/20 text-primary border-2 border-primary"
                              : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {completedSets.includes(i + 1) ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          i + 1
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-3">
                    {currentExercise.reps} repetições · {currentExercise.restSeconds}s descanso
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <Button 
                    onClick={handleCompleteSet} 
                    className="w-full h-14 text-lg btn-primary-gradient"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Completar Série {currentSet}
                  </Button>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handlePreviousExercise}
                      disabled={currentExerciseIndex === 0}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleNextExercise}
                      disabled={currentExerciseIndex === totalExercises - 1}
                    >
                      Próximo
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
