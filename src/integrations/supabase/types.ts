export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          cliente_email: string | null
          cliente_nome: string
          cliente_telefone: string
          created_at: string
          data_agendamento: string
          empresa_id: string | null
          horario: string
          id: string
          link_agendamento: string
          profissional_id: string | null
          servico_id: string | null
          status: string | null
          status_confirmacao: string | null
        }
        Insert: {
          cliente_email?: string | null
          cliente_nome: string
          cliente_telefone: string
          created_at?: string
          data_agendamento: string
          empresa_id?: string | null
          horario: string
          id?: string
          link_agendamento: string
          profissional_id?: string | null
          servico_id?: string | null
          status?: string | null
          status_confirmacao?: string | null
        }
        Update: {
          cliente_email?: string | null
          cliente_nome?: string
          cliente_telefone?: string
          created_at?: string
          data_agendamento?: string
          empresa_id?: string | null
          horario?: string
          id?: string
          link_agendamento?: string
          profissional_id?: string | null
          servico_id?: string | null
          status?: string | null
          status_confirmacao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      bloqueios: {
        Row: {
          criado_em: string
          data: string
          descricao: string | null
          empresa_id: string
          hora_fim: string
          hora_inicio: string
          id: string
        }
        Insert: {
          criado_em?: string
          data: string
          descricao?: string | null
          empresa_id: string
          hora_fim: string
          hora_inicio: string
          id?: string
        }
        Update: {
          criado_em?: string
          data?: string
          descricao?: string | null
          empresa_id?: string
          hora_fim?: string
          hora_inicio?: string
          id?: string
        }
        Relationships: []
      }
      empresas: {
        Row: {
          created_at: string
          endereco: string | null
          horarios_funcionamento: Json | null
          id: string
          link_agendamento: string | null
          nome_negocio: string
          owner_id: string
          slug: string | null
          telefone: string | null
          tipo: string
        }
        Insert: {
          created_at?: string
          endereco?: string | null
          horarios_funcionamento?: Json | null
          id?: string
          link_agendamento?: string | null
          nome_negocio: string
          owner_id: string
          slug?: string | null
          telefone?: string | null
          tipo: string
        }
        Update: {
          created_at?: string
          endereco?: string | null
          horarios_funcionamento?: Json | null
          id?: string
          link_agendamento?: string | null
          nome_negocio?: string
          owner_id?: string
          slug?: string | null
          telefone?: string | null
          tipo?: string
        }
        Relationships: []
      }
      profissionais: {
        Row: {
          ativo: boolean
          created_at: string
          empresa_id: string
          especialidade: string
          horarios_disponiveis: Json | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          empresa_id: string
          especialidade: string
          horarios_disponiveis?: Json | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          empresa_id?: string
          especialidade?: string
          horarios_disponiveis?: Json | null
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "profissionais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          ativo: boolean | null
          created_at: string
          duracao_em_minutos: number
          empresa_id: string | null
          id: string
          nome: string
          preco: number
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          duracao_em_minutos: number
          empresa_id?: string | null
          id?: string
          nome: string
          preco: number
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          duracao_em_minutos?: number
          empresa_id?: string | null
          id?: string
          nome?: string
          preco?: number
        }
        Relationships: [
          {
            foreignKeyName: "servicos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: {
        Args: { input_text: string }
        Returns: string
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
