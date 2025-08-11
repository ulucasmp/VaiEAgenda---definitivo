export interface Plan {
  id: string;
  name: string;
  description: string;
  max_profissionais: number;
  max_agendamentos_mes: number;
  excedente_valor: number;
  features: Record<string, any>;
  created_at: string;
}

export interface CompanySubscription {
  id: string;
  company_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  status: 'trial' | 'active' | 'suspended' | 'cancelled';
  trial_end_date?: string;
  created_at: string;
  plan?: Plan;
}

export interface UsageExcedente {
  id: string;
  company_id: string;
  ciclo_inicio: string;
  ciclo_fim: string;
  tipo: 'agendamentos' | 'profissionais';
  quantidade_excedente: number;
  valor_total: number;
  created_at: string;
}

export interface PlanUsage {
  plan?: Plan;
  totalProfissionais: number;
  totalAgendamentosMes: number;
  excedentes?: UsageExcedente[];
  isLoading: boolean;
}
