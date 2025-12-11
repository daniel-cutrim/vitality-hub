-- Criar enum para tipos de desafio
CREATE TYPE public.challenge_type AS ENUM ('individual', 'versus', 'grupo');

-- Criar enum para status de desafio
CREATE TYPE public.challenge_status AS ENUM ('ativo', 'concluido', 'cancelado');

-- Criar enum para categorias de badges
CREATE TYPE public.badge_category AS ENUM ('conquistas', 'desafios', 'rankings', 'especiais');

-- Tabela de níveis
CREATE TABLE public.niveis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  pontos_necessarios INTEGER NOT NULL DEFAULT 0,
  ordem INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir os 8 níveis
INSERT INTO public.niveis (nome, descricao, pontos_necessarios, ordem) VALUES
  ('Frango', 'Ainda mal sai do ovo', 0, 1),
  ('Maromba Fake', 'Posta foto mas não treina', 500, 2),
  ('Shape de Verão', 'Só na época certa', 1500, 3),
  ('Guerreiro', 'Consistência é a chave', 3500, 4),
  ('Monstro', 'Respeita o shape', 7000, 5),
  ('Monstro das Antigas', 'Old school de respeito', 15000, 6),
  ('Bruxo do Shape', 'Fez pacto com os ganhos', 30000, 7),
  ('Senhor do Olimpo', 'Chegou no topo absoluto', 60000, 8);

-- Tabela de pontuação dos usuários
CREATE TABLE public.pontuacao_usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pontos_totais INTEGER NOT NULL DEFAULT 0,
  pontos_semana INTEGER NOT NULL DEFAULT 0,
  pontos_mes INTEGER NOT NULL DEFAULT 0,
  nivel_atual INTEGER NOT NULL DEFAULT 1,
  streak_dias INTEGER NOT NULL DEFAULT 0,
  ultimo_streak_check DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Tabela de histórico de pontos
CREATE TABLE public.historico_pontos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  acao TEXT NOT NULL,
  pontos INTEGER NOT NULL,
  multiplicador NUMERIC(3,2) NOT NULL DEFAULT 1.0,
  pontos_finais INTEGER NOT NULL,
  referencia_tipo TEXT,
  referencia_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de badges
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria badge_category NOT NULL DEFAULT 'conquistas',
  icone TEXT NOT NULL DEFAULT 'trophy',
  requisito TEXT,
  requisito_valor INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir badges iniciais
INSERT INTO public.badges (nome, descricao, categoria, icone, requisito, requisito_valor) VALUES
  ('Primeira Vitória', 'Completou o primeiro treino', 'conquistas', 'zap', 'treinos_completos', 1),
  ('Dedicado', 'Completou 10 treinos', 'conquistas', 'dumbbell', 'treinos_completos', 10),
  ('Iron Man', 'Completou 100 treinos', 'conquistas', 'medal', 'treinos_completos', 100),
  ('Streak de Bronze', '7 dias consecutivos', 'conquistas', 'flame', 'streak_dias', 7),
  ('Streak de Prata', '14 dias consecutivos', 'conquistas', 'flame', 'streak_dias', 14),
  ('Streak de Ouro', '30 dias consecutivos', 'conquistas', 'flame', 'streak_dias', 30),
  ('Dieta Iniciante', '7 dias de dieta cumprida', 'conquistas', 'apple', 'dieta_dias', 7),
  ('Dieta de Monge', '30 dias de dieta perfeita', 'conquistas', 'sparkles', 'dieta_dias', 30),
  ('Desafiante', 'Criou o primeiro desafio', 'desafios', 'target', 'desafios_criados', 1),
  ('Competidor', 'Venceu 5 desafios', 'desafios', 'trophy', 'desafios_vencidos', 5),
  ('Campeão', 'Venceu 20 desafios', 'desafios', 'crown', 'desafios_vencidos', 20),
  ('Líder de Grupo', 'Grupo completou meta coletiva', 'desafios', 'users', 'grupo_completo', 1),
  ('Top 1 Semanal', 'Primeiro lugar no ranking semanal', 'rankings', 'medal', 'ranking_semanal', 1),
  ('Top 3 Mensal', 'Top 3 no ranking mensal', 'rankings', 'award', 'ranking_mensal', 3),
  ('Hall da Fama', 'Top 10 no ranking geral', 'rankings', 'star', 'ranking_geral', 10);

-- Tabela de badges conquistados por usuários
CREATE TABLE public.usuarios_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  conquistado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Tabela de desafios
CREATE TABLE public.desafios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  criador_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo challenge_type NOT NULL DEFAULT 'individual',
  nome TEXT NOT NULL,
  meta TEXT NOT NULL,
  meta_numero INTEGER NOT NULL,
  duracao_dias INTEGER NOT NULL DEFAULT 7,
  recompensa_pontos INTEGER NOT NULL DEFAULT 100,
  badge_id UUID REFERENCES public.badges(id),
  inicio TIMESTAMP WITH TIME ZONE DEFAULT now(),
  fim TIMESTAMP WITH TIME ZONE,
  status challenge_status NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de participantes de desafios
CREATE TABLE public.desafios_participantes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  desafio_id UUID NOT NULL REFERENCES public.desafios(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progresso_atual INTEGER NOT NULL DEFAULT 0,
  aceito BOOLEAN DEFAULT true,
  concluido BOOLEAN DEFAULT false,
  pontos_ganhos INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(desafio_id, user_id)
);

-- Tabela de snapshot de rankings (cache)
CREATE TABLE public.rankings_snapshot (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  periodo TEXT NOT NULL,
  posicao INTEGER NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pontos INTEGER NOT NULL DEFAULT 0,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de amigos fictícios para demonstração
CREATE TABLE public.amigos_ficticios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  avatar_iniciais TEXT NOT NULL,
  avatar_cor TEXT NOT NULL,
  nivel INTEGER NOT NULL DEFAULT 1,
  pontos INTEGER NOT NULL DEFAULT 0,
  online BOOLEAN DEFAULT false,
  ultimo_treino TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir 20 amigos fictícios
INSERT INTO public.amigos_ficticios (nome, avatar_iniciais, avatar_cor, nivel, pontos, online, ultimo_treino) VALUES
  ('Lucas Silva', 'LS', '#10B981', 5, 8500, true, now() - interval '2 hours'),
  ('Maria Santos', 'MS', '#3B82F6', 4, 5200, false, now() - interval '1 day'),
  ('João Pedro', 'JP', '#8B5CF6', 6, 18000, true, now() - interval '30 minutes'),
  ('Ana Clara', 'AC', '#EC4899', 3, 2800, false, now() - interval '3 days'),
  ('Rafael Costa', 'RC', '#F59E0B', 7, 35000, true, now() - interval '1 hour'),
  ('Carla Mendes', 'CM', '#EF4444', 4, 4500, false, now() - interval '5 hours'),
  ('Bruno Oliveira', 'BO', '#06B6D4', 5, 9200, true, now() - interval '45 minutes'),
  ('Juliana Lima', 'JL', '#84CC16', 3, 3100, false, now() - interval '2 days'),
  ('Pedro Henrique', 'PH', '#F97316', 6, 22000, true, now() - interval '15 minutes'),
  ('Fernanda Souza', 'FS', '#A855F7', 4, 6800, false, now() - interval '6 hours'),
  ('Gustavo Alves', 'GA', '#14B8A6', 5, 11000, true, now() - interval '3 hours'),
  ('Camila Rocha', 'CR', '#E11D48', 3, 2200, false, now() - interval '4 days'),
  ('Thiago Martins', 'TM', '#0EA5E9', 7, 42000, true, now() - interval '20 minutes'),
  ('Isabela Ferreira', 'IF', '#D946EF', 4, 5800, false, now() - interval '8 hours'),
  ('Mateus Barbosa', 'MB', '#22C55E', 5, 7500, true, now() - interval '1 hour'),
  ('Letícia Cardoso', 'LC', '#F43F5E', 3, 3400, false, now() - interval '1 day'),
  ('Diego Nascimento', 'DN', '#6366F1', 6, 16500, true, now() - interval '40 minutes'),
  ('Bianca Ribeiro', 'BR', '#FB923C', 4, 4100, false, now() - interval '12 hours'),
  ('Felipe Gomes', 'FG', '#2DD4BF', 5, 10500, true, now() - interval '2 hours'),
  ('Amanda Pereira', 'AP', '#C026D3', 4, 5500, false, now() - interval '9 hours');

-- Enable RLS
ALTER TABLE public.niveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pontuacao_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_pontos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desafios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desafios_participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rankings_snapshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amigos_ficticios ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view niveis" ON public.niveis FOR SELECT USING (true);
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Anyone can view amigos_ficticios" ON public.amigos_ficticios FOR SELECT USING (true);
CREATE POLICY "Anyone can view rankings" ON public.rankings_snapshot FOR SELECT USING (true);

CREATE POLICY "Users can view own pontuacao" ON public.pontuacao_usuarios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pontuacao" ON public.pontuacao_usuarios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pontuacao" ON public.pontuacao_usuarios FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own historico" ON public.historico_pontos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own historico" ON public.historico_pontos FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own badges" ON public.usuarios_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON public.usuarios_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view desafios they participate" ON public.desafios FOR SELECT USING (
  criador_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.desafios_participantes WHERE desafio_id = id AND user_id = auth.uid())
);
CREATE POLICY "Users can create desafios" ON public.desafios FOR INSERT WITH CHECK (auth.uid() = criador_id);
CREATE POLICY "Users can update own desafios" ON public.desafios FOR UPDATE USING (auth.uid() = criador_id);

CREATE POLICY "Users can view participantes" ON public.desafios_participantes FOR SELECT USING (true);
CREATE POLICY "Users can insert participantes" ON public.desafios_participantes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own participacao" ON public.desafios_participantes FOR UPDATE USING (auth.uid() = user_id);

-- Function to calculate streak multiplier
CREATE OR REPLACE FUNCTION public.get_streak_multiplier(streak_dias INTEGER)
RETURNS NUMERIC AS $$
BEGIN
  IF streak_dias >= 30 THEN RETURN 3.0;
  ELSIF streak_dias >= 14 THEN RETURN 2.0;
  ELSIF streak_dias >= 7 THEN RETURN 1.5;
  ELSIF streak_dias >= 3 THEN RETURN 1.2;
  ELSE RETURN 1.0;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get user level based on points
CREATE OR REPLACE FUNCTION public.get_user_level(pontos INTEGER)
RETURNS INTEGER AS $$
DECLARE
  nivel_ordem INTEGER;
BEGIN
  SELECT ordem INTO nivel_ordem FROM public.niveis 
  WHERE pontos_necessarios <= pontos 
  ORDER BY pontos_necessarios DESC 
  LIMIT 1;
  RETURN COALESCE(nivel_ordem, 1);
END;
$$ LANGUAGE plpgsql;