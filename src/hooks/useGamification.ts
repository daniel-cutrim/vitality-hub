import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Nivel {
  id: string;
  nome: string;
  descricao: string;
  pontos_necessarios: number;
  ordem: number;
}

export interface PontuacaoUsuario {
  id: string;
  user_id: string;
  pontos_totais: number;
  pontos_semana: number;
  pontos_mes: number;
  nivel_atual: number;
  streak_dias: number;
  ultimo_streak_check: string | null;
}

export interface Badge {
  id: string;
  nome: string;
  descricao: string;
  categoria: 'conquistas' | 'desafios' | 'rankings' | 'especiais';
  icone: string;
  requisito: string | null;
  requisito_valor: number | null;
}

export interface UsuarioBadge {
  id: string;
  user_id: string;
  badge_id: string;
  conquistado_em: string;
  badge?: Badge;
}

export interface Desafio {
  id: string;
  criador_id: string;
  tipo: 'individual' | 'versus' | 'grupo';
  nome: string;
  meta: string;
  meta_numero: number;
  duracao_dias: number;
  recompensa_pontos: number;
  badge_id: string | null;
  inicio: string;
  fim: string | null;
  status: 'ativo' | 'concluido' | 'cancelado';
}

export interface DesafioParticipante {
  id: string;
  desafio_id: string;
  user_id: string;
  progresso_atual: number;
  aceito: boolean;
  concluido: boolean;
  pontos_ganhos: number;
}

export interface HistoricoPontos {
  id: string;
  user_id: string;
  acao: string;
  pontos: number;
  multiplicador: number;
  pontos_finais: number;
  created_at: string;
}

export interface AmigoFicticio {
  id: string;
  nome: string;
  avatar_iniciais: string;
  avatar_cor: string;
  nivel: number;
  pontos: number;
  online: boolean;
  ultimo_treino: string | null;
}

export interface RankingItem {
  posicao: number;
  user_id: string;
  nome: string;
  avatar_iniciais: string;
  avatar_cor: string;
  nivel: number;
  pontos: number;
  isCurrentUser?: boolean;
}

const NIVEIS_INFO: Record<number, { nome: string; descricao: string }> = {
  1: { nome: 'Frango', descricao: 'Ainda mal sai do ovo' },
  2: { nome: 'Maromba Fake', descricao: 'Posta foto mas não treina' },
  3: { nome: 'Shape de Verão', descricao: 'Só na época certa' },
  4: { nome: 'Guerreiro', descricao: 'Consistência é a chave' },
  5: { nome: 'Monstro', descricao: 'Respeita o shape' },
  6: { nome: 'Monstro das Antigas', descricao: 'Old school de respeito' },
  7: { nome: 'Bruxo do Shape', descricao: 'Fez pacto com os ganhos' },
  8: { nome: 'Senhor do Olimpo', descricao: 'Chegou no topo absoluto' },
};

const NIVEL_PONTOS: Record<number, number> = {
  1: 0,
  2: 500,
  3: 1500,
  4: 3500,
  5: 7000,
  6: 15000,
  7: 30000,
  8: 60000,
};

export function useGamification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pontuacao, setPontuacao] = useState<PontuacaoUsuario | null>(null);
  const [niveis, setNiveis] = useState<Nivel[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UsuarioBadge[]>([]);
  const [desafiosAtivos, setDesafiosAtivos] = useState<Desafio[]>([]);
  const [historico, setHistorico] = useState<HistoricoPontos[]>([]);
  const [amigos, setAmigos] = useState<AmigoFicticio[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState<number | null>(null);

  const nivelAtual = pontuacao ? NIVEIS_INFO[pontuacao.nivel_atual] : NIVEIS_INFO[1];
  const pontosProximoNivel = pontuacao 
    ? NIVEL_PONTOS[Math.min(pontuacao.nivel_atual + 1, 8)] - pontuacao.pontos_totais
    : NIVEL_PONTOS[2];
  const progressoNivel = pontuacao 
    ? ((pontuacao.pontos_totais - NIVEL_PONTOS[pontuacao.nivel_atual]) / 
       (NIVEL_PONTOS[Math.min(pontuacao.nivel_atual + 1, 8)] - NIVEL_PONTOS[pontuacao.nivel_atual])) * 100
    : 0;

  const getStreakMultiplier = (streak: number): number => {
    if (streak >= 30) return 3.0;
    if (streak >= 14) return 2.0;
    if (streak >= 7) return 1.5;
    if (streak >= 3) return 1.2;
    return 1.0;
  };

  const fetchData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch user pontuacao
      const { data: pontuacaoData, error: pontuacaoError } = await supabase
        .from('pontuacao_usuarios')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (pontuacaoError) throw pontuacaoError;

      if (!pontuacaoData) {
        // Create initial pontuacao for user
        const { data: newPontuacao, error: createError } = await supabase
          .from('pontuacao_usuarios')
          .insert({ user_id: user.id })
          .select()
          .single();
        
        if (createError) throw createError;
        setPontuacao(newPontuacao as PontuacaoUsuario);
      } else {
        setPontuacao(pontuacaoData as PontuacaoUsuario);
      }

      // Fetch all data in parallel
      const [
        { data: niveisData },
        { data: badgesData },
        { data: userBadgesData },
        { data: desafiosData },
        { data: historicoData },
        { data: amigosData },
      ] = await Promise.all([
        supabase.from('niveis').select('*').order('ordem'),
        supabase.from('badges').select('*'),
        supabase.from('usuarios_badges').select('*, badges(*)').eq('user_id', user.id),
        supabase
          .from('desafios_participantes')
          .select('*, desafios(*)')
          .eq('user_id', user.id),
        supabase
          .from('historico_pontos')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50),
        supabase.from('amigos_ficticios').select('*'),
      ]);

      setNiveis((niveisData || []) as Nivel[]);
      setBadges((badgesData || []) as Badge[]);
      setUserBadges((userBadgesData || []) as UsuarioBadge[]);
      
      // Extract desafios from participantes
      const activeDesafios = (desafiosData || [])
        .map((p: any) => p.desafios)
        .filter((d: any) => d && d.status === 'ativo') as Desafio[];
      setDesafiosAtivos(activeDesafios);
      
      setHistorico((historicoData || []) as HistoricoPontos[]);
      setAmigos((amigosData || []) as AmigoFicticio[]);
    } catch (error) {
      console.error('Error fetching gamification data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addPoints = async (
    acao: string, 
    pontos: number, 
    referenciaId?: string, 
    referenciaTipo?: string
  ) => {
    if (!user || !pontuacao) return;

    const multiplicador = getStreakMultiplier(pontuacao.streak_dias);
    const pontosFinais = Math.floor(pontos * multiplicador);
    const novoTotal = pontuacao.pontos_totais + pontosFinais;
    
    // Calculate new level
    let novoNivel = pontuacao.nivel_atual;
    for (let i = 8; i >= 1; i--) {
      if (novoTotal >= NIVEL_PONTOS[i]) {
        novoNivel = i;
        break;
      }
    }

    try {
      // Insert historico
      await supabase.from('historico_pontos').insert({
        user_id: user.id,
        acao,
        pontos,
        multiplicador,
        pontos_finais: pontosFinais,
        referencia_tipo: referenciaTipo,
        referencia_id: referenciaId,
      });

      // Update pontuacao
      const { data: updatedPontuacao, error } = await supabase
        .from('pontuacao_usuarios')
        .update({
          pontos_totais: novoTotal,
          pontos_semana: pontuacao.pontos_semana + pontosFinais,
          pontos_mes: pontuacao.pontos_mes + pontosFinais,
          nivel_atual: novoNivel,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setPontuacao(updatedPontuacao as PontuacaoUsuario);

      // Show level up modal if leveled up
      if (novoNivel > pontuacao.nivel_atual) {
        setNewLevel(novoNivel);
        setShowLevelUp(true);
      }

      // Show toast
      toast({
        title: `+${pontosFinais} pts | ${acao}`,
        description: multiplicador > 1 ? `Streak ×${multiplicador} ativado! 🔥` : undefined,
      });

      return pontosFinais;
    } catch (error) {
      console.error('Error adding points:', error);
      throw error;
    }
  };

  const updateStreak = async (completed: boolean) => {
    if (!user || !pontuacao) return;

    const today = new Date().toISOString().split('T')[0];
    const lastCheck = pontuacao.ultimo_streak_check;
    
    let newStreak = pontuacao.streak_dias;
    
    if (completed) {
      if (!lastCheck || lastCheck !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastCheck === yesterdayStr) {
          newStreak += 1;
        } else if (lastCheck !== today) {
          newStreak = 1;
        }
      }
    } else {
      newStreak = 0;
    }

    try {
      const { data, error } = await supabase
        .from('pontuacao_usuarios')
        .update({
          streak_dias: newStreak,
          ultimo_streak_check: today,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setPontuacao(data as PontuacaoUsuario);

      // Check for streak badges
      if (newStreak === 7 || newStreak === 14 || newStreak === 30) {
        toast({
          title: `Streak de ${newStreak} dias! 🔥`,
          description: `Multiplicador ×${getStreakMultiplier(newStreak)} ativado!`,
        });
      }

      return newStreak;
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const createDesafio = async (desafio: Partial<Desafio>) => {
    if (!user) return;

    const fim = new Date();
    fim.setDate(fim.getDate() + (desafio.duracao_dias || 7));

    try {
      const { data, error } = await supabase
        .from('desafios')
        .insert({
          criador_id: user.id,
          tipo: desafio.tipo || 'individual',
          nome: desafio.nome || 'Novo Desafio',
          meta: desafio.meta || 'treinos_completos',
          meta_numero: desafio.meta_numero || 10,
          duracao_dias: desafio.duracao_dias || 7,
          recompensa_pontos: desafio.recompensa_pontos || 100,
          fim: fim.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as participant
      await supabase.from('desafios_participantes').insert({
        desafio_id: data.id,
        user_id: user.id,
      });

      await fetchData();
      
      toast({
        title: 'Desafio criado!',
        description: 'Boa sorte! 💪',
      });

      return data;
    } catch (error) {
      console.error('Error creating desafio:', error);
      throw error;
    }
  };

  const generateRankings = (periodo: 'semanal' | 'mensal' | 'geral'): RankingItem[] => {
    // Mix current user with fake friends for demo
    const allUsers: RankingItem[] = amigos.map((amigo, index) => ({
      posicao: 0,
      user_id: amigo.id,
      nome: amigo.nome,
      avatar_iniciais: amigo.avatar_iniciais,
      avatar_cor: amigo.avatar_cor,
      nivel: amigo.nivel,
      pontos: periodo === 'semanal' 
        ? Math.floor(amigo.pontos * 0.1) 
        : periodo === 'mensal' 
          ? Math.floor(amigo.pontos * 0.4) 
          : amigo.pontos,
    }));

    // Add current user
    if (pontuacao) {
      allUsers.push({
        posicao: 0,
        user_id: user?.id || '',
        nome: 'Você',
        avatar_iniciais: 'EU',
        avatar_cor: '#10B981',
        nivel: pontuacao.nivel_atual,
        pontos: periodo === 'semanal' 
          ? pontuacao.pontos_semana 
          : periodo === 'mensal' 
            ? pontuacao.pontos_mes 
            : pontuacao.pontos_totais,
        isCurrentUser: true,
      });
    }

    // Sort by points and assign positions
    return allUsers
      .sort((a, b) => b.pontos - a.pontos)
      .map((item, index) => ({ ...item, posicao: index + 1 }));
  };

  return {
    loading,
    pontuacao,
    nivelAtual,
    pontosProximoNivel,
    progressoNivel,
    niveis,
    badges,
    userBadges,
    desafiosAtivos,
    historico,
    amigos,
    showLevelUp,
    newLevel,
    setShowLevelUp,
    addPoints,
    updateStreak,
    createDesafio,
    generateRankings,
    getStreakMultiplier,
    refetch: fetchData,
    NIVEIS_INFO,
  };
}
