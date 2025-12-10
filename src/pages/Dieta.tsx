import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Coffee, 
  Sun, 
  Moon, 
  Cookie, 
  Plus,
  ChevronRight,
  Lock,
  Flame,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import { MealLogModal } from '@/components/modals/MealLogModal';

interface Meal {
  id: number;
  type: string;
  time: string;
  icon: React.ElementType;
  foods: string[];
  calories: number;
  macros: { p: number; c: number; g: number };
  logged: boolean;
}

const mockMeals: Meal[] = [
  {
    id: 1,
    type: 'Café da Manhã',
    time: '07:00',
    icon: Coffee,
    foods: ['2 ovos mexidos', 'Pão integral', 'Banana', 'Café s/ açúcar'],
    calories: 380,
    macros: { p: 22, c: 45, g: 12 },
    logged: true
  },
  {
    id: 2,
    type: 'Almoço',
    time: '12:00',
    icon: Sun,
    foods: ['150g frango grelhado', 'Arroz integral', 'Feijão', 'Salada'],
    calories: 550,
    macros: { p: 40, c: 55, g: 15 },
    logged: true
  },
  {
    id: 3,
    type: 'Lanche da Tarde',
    time: '16:00',
    icon: Cookie,
    foods: ['Shake de whey', 'Aveia', 'Morango'],
    calories: 320,
    macros: { p: 30, c: 35, g: 8 },
    logged: false
  },
  {
    id: 4,
    type: 'Jantar',
    time: '20:00',
    icon: Moon,
    foods: ['150g peixe', 'Batata doce', 'Brócolis'],
    calories: 420,
    macros: { p: 35, c: 40, g: 10 },
    logged: false
  }
];

export default function Dieta() {
  const { isPremium, user } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [loggedMeals, setLoggedMeals] = useState<string[]>([]);

  const fetchLoggedMeals = async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('checkin_dieta')
      .select('refeicao')
      .eq('user_id', user.id)
      .eq('data', today);
    
    if (data) {
      setLoggedMeals(data.map(d => d.refeicao));
    }
  };

  useEffect(() => {
    fetchLoggedMeals();
  }, [user]);

  const mealsWithStatus = mockMeals.map(meal => ({
    ...meal,
    logged: loggedMeals.includes(meal.type)
  }));

  const totalCalories = 2000;
  const consumedCalories = mealsWithStatus.filter(m => m.logged).reduce((acc, m) => acc + m.calories, 0);
  const progress = (consumedCalories / totalCalories) * 100;

  const totalMacros = mealsWithStatus.filter(m => m.logged).reduce(
    (acc, m) => ({
      p: acc.p + m.macros.p,
      c: acc.c + m.macros.c,
      g: acc.g + m.macros.g
    }),
    { p: 0, c: 0, g: 0 }
  );

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-foreground">Plano Alimentar</h1>
        <p className="text-muted-foreground">Suas refeições de hoje</p>
      </motion.div>

      {/* Calorie Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border p-4 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Calorias</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {consumedCalories} / {totalCalories} kcal
          </span>
        </div>
        <div className="progress-bar mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="progress-bar-fill"
          />
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-foreground">{totalMacros.p}g</p>
            <p className="text-xs text-muted-foreground">Proteína</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{totalMacros.c}g</p>
            <p className="text-xs text-muted-foreground">Carboidrato</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{totalMacros.g}g</p>
            <p className="text-xs text-muted-foreground">Gordura</p>
          </div>
        </div>
      </motion.div>

      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-amber-900">Dieta Genérica</p>
              <p className="text-sm text-amber-700">Personalize com base nos seus objetivos</p>
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

      {/* Meals Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
        
        <div className="space-y-4">
          {mealsWithStatus.map((meal, index) => {
            const Icon = meal.icon;
            
            return (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className={cn(
                  "relative pl-14",
                  !meal.logged && "opacity-60"
                )}
              >
                <div className={cn(
                  "absolute left-0 w-12 h-12 rounded-full flex items-center justify-center z-10",
                  meal.logged ? "bg-primary text-primary-foreground" : "bg-card border-2 border-border"
                )}>
                  {meal.logged ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>

                <div className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{meal.type}</h3>
                      <p className="text-xs text-muted-foreground">{meal.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{meal.calories} kcal</p>
                      <p className="text-xs text-muted-foreground">
                        P: {meal.macros.p}g C: {meal.macros.c}g G: {meal.macros.g}g
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {meal.foods.map((food, i) => (
                      <span 
                        key={i}
                        className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground"
                      >
                        {food}
                      </span>
                    ))}
                  </div>

                  {meal.logged ? (
                    <div className="flex items-center justify-center gap-2 py-2 text-primary">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Registrado</span>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedMeal(meal)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Registrar Refeição
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
      
      {selectedMeal && (
        <MealLogModal
          open={!!selectedMeal}
          onOpenChange={(open) => !open && setSelectedMeal(null)}
          meal={selectedMeal}
          onSuccess={fetchLoggedMeals}
        />
      )}
    </AppLayout>
  );
}
