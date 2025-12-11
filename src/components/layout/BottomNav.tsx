import { NavLink, useLocation } from 'react-router-dom';
import { Home, Dumbbell, Apple, Trophy, ShoppingBag, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/treino', icon: Dumbbell, label: 'Treino' },
  { to: '/dieta', icon: Apple, label: 'Dieta' },
  { to: '/desafios', icon: Trophy, label: 'Desafios' },
  { to: '/shopping', icon: ShoppingBag, label: 'Loja' },
  { to: '/perfil', icon: User, label: 'Perfil' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav safe-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || 
            (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "bottom-nav-item relative flex-1",
                isActive && "active"
              )}
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -inset-2 bg-accent rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon className={cn(
                  "relative z-10 w-6 h-6 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <span className={cn(
                "text-xs mt-1 font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
