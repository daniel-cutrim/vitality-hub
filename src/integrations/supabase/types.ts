export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      amigos_ficticios: {
        Row: {
          avatar_cor: string
          avatar_iniciais: string
          created_at: string | null
          id: string
          nivel: number
          nome: string
          online: boolean | null
          pontos: number
          ultimo_treino: string | null
        }
        Insert: {
          avatar_cor: string
          avatar_iniciais: string
          created_at?: string | null
          id?: string
          nivel?: number
          nome: string
          online?: boolean | null
          pontos?: number
          ultimo_treino?: string | null
        }
        Update: {
          avatar_cor?: string
          avatar_iniciais?: string
          created_at?: string | null
          id?: string
          nivel?: number
          nome?: string
          online?: boolean | null
          pontos?: number
          ultimo_treino?: string | null
        }
        Relationships: []
      }
      anamnese: {
        Row: {
          created_at: string | null
          dados_pessoais: Json | null
          fotos_iniciais: string[] | null
          historico_saude: Json | null
          id: string
          rotina: Json | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dados_pessoais?: Json | null
          fotos_iniciais?: string[] | null
          historico_saude?: Json | null
          id?: string
          rotina?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dados_pessoais?: Json | null
          fotos_iniciais?: string[] | null
          historico_saude?: Json | null
          id?: string
          rotina?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "anamnese_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          categoria: Database["public"]["Enums"]["badge_category"]
          created_at: string | null
          descricao: string | null
          icone: string
          id: string
          nome: string
          requisito: string | null
          requisito_valor: number | null
        }
        Insert: {
          categoria?: Database["public"]["Enums"]["badge_category"]
          created_at?: string | null
          descricao?: string | null
          icone?: string
          id?: string
          nome: string
          requisito?: string | null
          requisito_valor?: number | null
        }
        Update: {
          categoria?: Database["public"]["Enums"]["badge_category"]
          created_at?: string | null
          descricao?: string | null
          icone?: string
          id?: string
          nome?: string
          requisito?: string | null
          requisito_valor?: number | null
        }
        Relationships: []
      }
      checkin_dieta: {
        Row: {
          calorias: number | null
          created_at: string | null
          data: string | null
          foto_url: string | null
          id: string
          macros_json: Json | null
          refeicao: string
          user_id: string
        }
        Insert: {
          calorias?: number | null
          created_at?: string | null
          data?: string | null
          foto_url?: string | null
          id?: string
          macros_json?: Json | null
          refeicao: string
          user_id: string
        }
        Update: {
          calorias?: number | null
          created_at?: string | null
          data?: string | null
          foto_url?: string | null
          id?: string
          macros_json?: Json | null
          refeicao?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkin_dieta_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      checkin_semanal: {
        Row: {
          created_at: string | null
          dificuldades: string | null
          fotos_evolucao: string[] | null
          id: string
          peso_atual: number | null
          semana_inicio: string
          sentimento: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dificuldades?: string | null
          fotos_evolucao?: string[] | null
          id?: string
          peso_atual?: number | null
          semana_inicio: string
          sentimento?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dificuldades?: string | null
          fotos_evolucao?: string[] | null
          id?: string
          peso_atual?: number | null
          semana_inicio?: string
          sentimento?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkin_semanal_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      checkin_treino: {
        Row: {
          created_at: string | null
          data: string | null
          duracao_minutos: number | null
          exercicios_json: Json | null
          id: string
          treino_completo: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: string | null
          duracao_minutos?: number | null
          exercicios_json?: Json | null
          id?: string
          treino_completo?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: string | null
          duracao_minutos?: number | null
          exercicios_json?: Json | null
          id?: string
          treino_completo?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkin_treino_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      desafios: {
        Row: {
          badge_id: string | null
          created_at: string | null
          criador_id: string
          duracao_dias: number
          fim: string | null
          id: string
          inicio: string | null
          meta: string
          meta_numero: number
          nome: string
          recompensa_pontos: number
          status: Database["public"]["Enums"]["challenge_status"]
          tipo: Database["public"]["Enums"]["challenge_type"]
        }
        Insert: {
          badge_id?: string | null
          created_at?: string | null
          criador_id: string
          duracao_dias?: number
          fim?: string | null
          id?: string
          inicio?: string | null
          meta: string
          meta_numero: number
          nome: string
          recompensa_pontos?: number
          status?: Database["public"]["Enums"]["challenge_status"]
          tipo?: Database["public"]["Enums"]["challenge_type"]
        }
        Update: {
          badge_id?: string | null
          created_at?: string | null
          criador_id?: string
          duracao_dias?: number
          fim?: string | null
          id?: string
          inicio?: string | null
          meta?: string
          meta_numero?: number
          nome?: string
          recompensa_pontos?: number
          status?: Database["public"]["Enums"]["challenge_status"]
          tipo?: Database["public"]["Enums"]["challenge_type"]
        }
        Relationships: [
          {
            foreignKeyName: "desafios_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      desafios_participantes: {
        Row: {
          aceito: boolean | null
          concluido: boolean | null
          created_at: string | null
          desafio_id: string
          id: string
          pontos_ganhos: number | null
          progresso_atual: number
          user_id: string
        }
        Insert: {
          aceito?: boolean | null
          concluido?: boolean | null
          created_at?: string | null
          desafio_id: string
          id?: string
          pontos_ganhos?: number | null
          progresso_atual?: number
          user_id: string
        }
        Update: {
          aceito?: boolean | null
          concluido?: boolean | null
          created_at?: string | null
          desafio_id?: string
          id?: string
          pontos_ganhos?: number | null
          progresso_atual?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "desafios_participantes_desafio_id_fkey"
            columns: ["desafio_id"]
            isOneToOne: false
            referencedRelation: "desafios"
            referencedColumns: ["id"]
          },
        ]
      }
      exercicios: {
        Row: {
          created_at: string | null
          descricao: string | null
          equipamento: string | null
          grupo_muscular: string | null
          id: string
          nome: string
          reps: string | null
          series: number | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          equipamento?: string | null
          grupo_muscular?: string | null
          id?: string
          nome: string
          reps?: string | null
          series?: number | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          equipamento?: string | null
          grupo_muscular?: string | null
          id?: string
          nome?: string
          reps?: string | null
          series?: number | null
          video_url?: string | null
        }
        Relationships: []
      }
      historico_pontos: {
        Row: {
          acao: string
          created_at: string | null
          id: string
          multiplicador: number
          pontos: number
          pontos_finais: number
          referencia_id: string | null
          referencia_tipo: string | null
          user_id: string
        }
        Insert: {
          acao: string
          created_at?: string | null
          id?: string
          multiplicador?: number
          pontos: number
          pontos_finais: number
          referencia_id?: string | null
          referencia_tipo?: string | null
          user_id: string
        }
        Update: {
          acao?: string
          created_at?: string | null
          id?: string
          multiplicador?: number
          pontos?: number
          pontos_finais?: number
          referencia_id?: string | null
          referencia_tipo?: string | null
          user_id?: string
        }
        Relationships: []
      }
      niveis: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          ordem: number
          pontos_necessarios: number
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          ordem: number
          pontos_necessarios?: number
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number
          pontos_necessarios?: number
        }
        Relationships: []
      }
      planos_alimentar: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          meta_calorias: number | null
          meta_carboidratos: number | null
          meta_gorduras: number | null
          meta_proteinas: number | null
          plano_json: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          meta_calorias?: number | null
          meta_carboidratos?: number | null
          meta_gorduras?: number | null
          meta_proteinas?: number | null
          plano_json: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          meta_calorias?: number | null
          meta_carboidratos?: number | null
          meta_gorduras?: number | null
          meta_proteinas?: number | null
          plano_json?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planos_alimentar_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      planos_treino: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          plano_json: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          plano_json: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          plano_json?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planos_treino_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pontuacao_usuarios: {
        Row: {
          created_at: string | null
          id: string
          nivel_atual: number
          pontos_mes: number
          pontos_semana: number
          pontos_totais: number
          streak_dias: number
          ultimo_streak_check: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nivel_atual?: number
          pontos_mes?: number
          pontos_semana?: number
          pontos_totais?: number
          streak_dias?: number
          ultimo_streak_check?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nivel_atual?: number
          pontos_mes?: number
          pontos_semana?: number
          pontos_totais?: number
          streak_dias?: number
          ultimo_streak_check?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      produtos_afiliados: {
        Row: {
          ativo: boolean | null
          categoria: string | null
          created_at: string | null
          descricao: string | null
          id: string
          imagem_url: string | null
          link_afiliado: string | null
          marca: string | null
          nome: string
          preco: number | null
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          link_afiliado?: string | null
          marca?: string | null
          nome: string
          preco?: number | null
        }
        Update: {
          ativo?: boolean | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          link_afiliado?: string | null
          marca?: string | null
          nome?: string
          preco?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          plan_type: Database["public"]["Enums"]["user_plan_type"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          plan_type?: Database["public"]["Enums"]["user_plan_type"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          plan_type?: Database["public"]["Enums"]["user_plan_type"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rankings_snapshot: {
        Row: {
          atualizado_em: string | null
          id: string
          periodo: string
          pontos: number
          posicao: number
          user_id: string
        }
        Insert: {
          atualizado_em?: string | null
          id?: string
          periodo: string
          pontos?: number
          posicao: number
          user_id: string
        }
        Update: {
          atualizado_em?: string | null
          id?: string
          periodo?: string
          pontos?: number
          posicao?: number
          user_id?: string
        }
        Relationships: []
      }
      usuarios_badges: {
        Row: {
          badge_id: string
          conquistado_em: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          conquistado_em?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          conquistado_em?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_streak_multiplier: { Args: { streak_dias: number }; Returns: number }
      get_user_level: { Args: { pontos: number }; Returns: number }
    }
    Enums: {
      badge_category: "conquistas" | "desafios" | "rankings" | "especiais"
      challenge_status: "ativo" | "concluido" | "cancelado"
      challenge_type: "individual" | "versus" | "grupo"
      user_plan_type: "free" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      badge_category: ["conquistas", "desafios", "rankings", "especiais"],
      challenge_status: ["ativo", "concluido", "cancelado"],
      challenge_type: ["individual", "versus", "grupo"],
      user_plan_type: ["free", "premium"],
    },
  },
} as const
