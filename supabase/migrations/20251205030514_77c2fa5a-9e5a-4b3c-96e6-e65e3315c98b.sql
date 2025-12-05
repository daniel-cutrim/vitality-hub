-- Create enum for user roles
CREATE TYPE user_plan_type AS ENUM ('free', 'premium');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan_type user_plan_type DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create anamnese table
CREATE TABLE public.anamnese (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  dados_pessoais JSONB,
  historico_saude JSONB,
  rotina JSONB,
  fotos_iniciais TEXT[],
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workout plans table
CREATE TABLE public.planos_treino (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plano_json JSONB NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meal plans table
CREATE TABLE public.planos_alimentar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plano_json JSONB NOT NULL,
  meta_calorias INTEGER,
  meta_proteinas INTEGER,
  meta_carboidratos INTEGER,
  meta_gorduras INTEGER,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workout checkins table
CREATE TABLE public.checkin_treino (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  data DATE DEFAULT CURRENT_DATE,
  treino_completo BOOLEAN DEFAULT false,
  exercicios_json JSONB,
  duracao_minutos INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meal checkins table
CREATE TABLE public.checkin_dieta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  data DATE DEFAULT CURRENT_DATE,
  refeicao TEXT NOT NULL,
  calorias INTEGER,
  macros_json JSONB,
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create weekly checkins table
CREATE TABLE public.checkin_semanal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  semana_inicio DATE NOT NULL,
  sentimento INTEGER CHECK (sentimento >= 1 AND sentimento <= 5),
  dificuldades TEXT,
  peso_atual DECIMAL(5,2),
  fotos_evolucao TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE public.exercicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  video_url TEXT,
  series INTEGER DEFAULT 3,
  reps TEXT DEFAULT '12',
  grupo_muscular TEXT,
  equipamento TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create affiliate products table
CREATE TABLE public.produtos_afiliados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  marca TEXT,
  descricao TEXT,
  imagem_url TEXT,
  preco DECIMAL(10,2),
  link_afiliado TEXT,
  categoria TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anamnese ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_treino ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_alimentar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkin_treino ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkin_dieta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkin_semanal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos_afiliados ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Anamnese policies
CREATE POLICY "Users can view own anamnese" ON public.anamnese FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own anamnese" ON public.anamnese FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own anamnese" ON public.anamnese FOR UPDATE USING (auth.uid() = user_id);

-- Workout plans policies
CREATE POLICY "Users can view own workout plans" ON public.planos_treino FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workout plans" ON public.planos_treino FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workout plans" ON public.planos_treino FOR UPDATE USING (auth.uid() = user_id);

-- Meal plans policies
CREATE POLICY "Users can view own meal plans" ON public.planos_alimentar FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meal plans" ON public.planos_alimentar FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meal plans" ON public.planos_alimentar FOR UPDATE USING (auth.uid() = user_id);

-- Workout checkins policies
CREATE POLICY "Users can view own workout checkins" ON public.checkin_treino FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workout checkins" ON public.checkin_treino FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workout checkins" ON public.checkin_treino FOR UPDATE USING (auth.uid() = user_id);

-- Meal checkins policies
CREATE POLICY "Users can view own meal checkins" ON public.checkin_dieta FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meal checkins" ON public.checkin_dieta FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meal checkins" ON public.checkin_dieta FOR UPDATE USING (auth.uid() = user_id);

-- Weekly checkins policies
CREATE POLICY "Users can view own weekly checkins" ON public.checkin_semanal FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weekly checkins" ON public.checkin_semanal FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own weekly checkins" ON public.checkin_semanal FOR UPDATE USING (auth.uid() = user_id);

-- Exercises policies (public read)
CREATE POLICY "Anyone can view exercises" ON public.exercicios FOR SELECT USING (true);

-- Products policies (public read)
CREATE POLICY "Anyone can view products" ON public.produtos_afiliados FOR SELECT USING (ativo = true);

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_anamnese_updated_at BEFORE UPDATE ON public.anamnese FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_planos_treino_updated_at BEFORE UPDATE ON public.planos_treino FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_planos_alimentar_updated_at BEFORE UPDATE ON public.planos_alimentar FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();