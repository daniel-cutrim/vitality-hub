import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Dumbbell, 
  Apple, 
  MessageCircle, 
  TrendingUp, 
  Check,
  ArrowRight,
  Star
} from 'lucide-react';

const features = [
  { icon: Dumbbell, title: 'Treinos Personalizados', description: 'Planos adaptados aos seus objetivos' },
  { icon: Apple, title: 'Dieta Inteligente', description: 'Nutrição baseada no seu metabolismo' },
  { icon: MessageCircle, title: 'Chat com IA', description: 'Tire dúvidas a qualquer momento' },
  { icon: TrendingUp, title: 'Acompanhamento', description: 'Veja sua evolução semana a semana' },
];

const testimonials = [
  { name: 'Maria S.', result: '-12kg em 3 meses', avatar: '👩' },
  { name: 'João P.', result: '+8kg de massa', avatar: '👨' },
  { name: 'Ana L.', result: 'Vida transformada', avatar: '👩‍🦰' },
];

export default function Landing() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="container max-w-lg mx-auto px-4 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/25">
              <svg className="w-10 h-10 text-primary-foreground" viewBox="0 0 100 100">
                <path d="M30 50 L42 62 L70 34" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Transforme seu corpo com o{' '}
              <span className="text-gradient">FitLife</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Treinos personalizados, dieta inteligente e acompanhamento profissional. Tudo em um só app.
            </p>

            <div className="flex flex-col gap-3">
              <Link to="/auth">
                <Button className="w-full btn-primary-gradient" size="lg">
                  Começar Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="w-full" size="lg">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features */}
      <section className="py-12 px-4">
        <div className="container max-w-lg mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-center text-foreground mb-8"
          >
            Por que escolher o FitLife?
          </motion.h2>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl border border-border p-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-4 bg-secondary/50">
        <div className="container max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-lg font-semibold text-foreground">4.9 de 5 estrelas</p>
            <p className="text-sm text-muted-foreground">+10.000 vidas transformadas</p>
          </motion.div>

          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-40 bg-card rounded-xl border border-border p-4 text-center"
              >
                <div className="text-4xl mb-2">{t.avatar}</div>
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-primary font-medium">{t.result}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="container max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-emerald-500 rounded-2xl p-6 text-center text-white"
          >
            <h2 className="text-2xl font-bold mb-2">
              Pronto para começar?
            </h2>
            <p className="text-white/80 mb-6">
              Sua transformação começa com um clique
            </p>
            <Link to="/auth">
              <Button className="bg-white text-primary hover:bg-white/90" size="lg">
                Criar Conta Grátis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container max-w-lg mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 100 100">
                <path d="M30 50 L42 62 L70 34" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <span className="font-bold text-foreground">FitLife</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2024 FitLife. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
