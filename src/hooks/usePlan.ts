import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import type { PlanUsage } from '../types/plans';

export function usePlan(companyId?: string): PlanUsage {
  const { data, isLoading } = useQuery({
    queryKey: ['plan', companyId],
    queryFn: async () => {
      if (!companyId) return null;

      // Buscar dados da empresa com plano
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          plan_id,
          plans (*)
        `)
        .eq('id', companyId)
        .single();

      if (companyError) throw companyError;

      // Buscar profissionais
      const { data: professionals, error: profError } = await supabase
        .from('professionals')
        .select('id')
        .eq('company_id', companyId);

      if (profError) throw profError;

      // Buscar agendamentos do mês atual
      const currentMonth = new Date();
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data: appointments, error: apptError } = await supabase
        .from('appointments')
        .select('id, scheduled_at')
        .eq('company_id', companyId)
        .gte('scheduled_at', startOfMonth.toISOString())
        .lte('scheduled_at', endOfMonth.toISOString());

      if (apptError) throw apptError;

      // Buscar excedentes
      const { data: excedentes, error: excError } = await supabase
        .from('usage_excedentes')
        .select('*')
        .eq('company_id', companyId)
        .gte('ciclo_inicio', startOfMonth.toISOString().split('T')[0])
        .lte('ciclo_fim', endOfMonth.toISOString().split('T')[0]);

      if (excError) throw excError;

      return {
        plan: company.plans,
        totalProfissionais: professionals?.length || 0,
        totalAgendamentosMes: appointments?.length || 0,
        excedentes: excedentes || []
      };
    },
    enabled: !!companyId
  });

  return {
    plan: data?.plan,
    totalProfissionais: data?.totalProfissionais || 0,
    totalAgendamentosMes: data?.totalAgendamentosMes || 0,
    excedentes: data?.excedentes || [],
    isLoading
  };
}
