// src/components/dashboard/PlanCard.tsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Crown, TrendingUp } from 'lucide-react';
import { usePlanContext } from '@/context/PlanContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function PlanCard() {
  const { plan, totalProfissionais, totalAgendamentosMes, isOverLimit } = usePlanContext();
  const { user } = useAuth();

  // Mostrar painel de teste apenas para seu e-mail
  const mostrarBotoesTeste = user?.email === 'lucasmacieladvocacia@gmail.com';

  // Função para trocar plano em tempo real
  const trocarPlano = async (nomePlano: string) => {
    try {
      // Busca o ID do plano selecionado
      const { data: planoSel, error: errPlan } = await supabase
        .from('plans')
        .select('id')
        .eq('name', nomePlano)
        .single();
      if (errPlan || !planoSel) throw errPlan || new Error('Plano não encontrado');

      // Atualiza a empresa para usar o novo plano
      await supabase
        .from('companies')
        .update({ plan_id: planoSel.id })
        .eq('id', user.company_id);

      // Recarrega a página para atualizar dados
      window.location.reload();
    } catch (error: any) {
      alert('Erro ao trocar plano: ' + error.message);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            <span>Plano {plan?.name}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Profissionais */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Profissionais</span>
            </div>
            <span className={isOverLimit('profissionais') ? 'text-red-600' : 'text-green-600'}>
              {totalProfissionais}/{plan?.max_profissionais}
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded">
            <div
              className={`${isOverLimit('profissionais') ? 'bg-red-500' : 'bg-green-500'} h-3 rounded`}
              style={{ width: `${Math.round((totalProfissionais / (plan?.max_profissionais||1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Agendamentos */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Agendamentos (mês)</span>
            </div>
            <span className={isOverLimit('agendamentos') ? 'text-red-600' : 'text-green-600'}>
              {totalAgendamentosMes}/{plan?.max_agendamentos_mes}
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded">
            <div
              className={`${isOverLimit('agendamentos') ? 'bg-red-500' : 'bg-green-500'} h-3 rounded`}
              style={{ width: `${Math.round((totalAgendamentosMes / (plan?.max_agendamentos_mes||1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Botões padrão */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1">
            Fazer Upgrade
          </Button>
          <Button variant="ghost" className="flex-1">
            Ver Histórico
          </Button>
        </div>

        {/* Painel de Teste */}
        {mostrarBotoesTeste && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">
              🧪 Painel de Teste – {user.email}
            </h4>
            <div className="flex gap-2 flex-wrap">
              {['Starter', 'Essential', 'Pro', 'Premium'].map((planoNome) => (
                <Button
                  key={planoNome}
                  size="sm"
                  variant={plan?.name === planoNome ? 'default' : 'outline'}
                  onClick={() => trocarPlano(planoNome)}
                  className="text-xs"
                >
                  {planoNome}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
