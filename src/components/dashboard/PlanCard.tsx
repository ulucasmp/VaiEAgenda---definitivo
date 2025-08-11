import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, Calendar, TrendingUp } from 'lucide-react';
import { usePlanContext } from '@/context/PlanContext';

export function PlanCard() {
  const { 
    plan, 
    totalProfissionais, 
    totalAgendamentosMes,
    isOverLimit,
    isLoading
  } = usePlanContext();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!plan) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-600">Nenhum plano encontrado. Entre em contato com o suporte.</p>
        </CardContent>
      </Card>
    );
  }

  const porcentAgendamentos = Math.round((totalAgendamentosMes / plan.max_agendamentos_mes) * 100);
  const porcentProfissionais = Math.round((totalProfissionais / plan.max_profissionais) * 100);

  const getPlanIcon = (planName: string) => {
    switch(planName.toLowerCase()) {
      case 'premium': return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'pro': return <TrendingUp className="w-5 h-5 text-purple-500" />;
      default: return <Crown className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch(planName.toLowerCase()) {
      case 'premium': return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'pro': return 'bg-gradient-to-r from-purple-400 to-purple-600';
      case 'essential': return 'bg-gradient-to-r from-green-400 to-green-600';
      default: return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className={`text-white ${getPlanColor(plan.name)} rounded-t-lg`}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getPlanIcon(plan.name)}
            <span>Plano {plan.name}</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white">
            Ativo
          </Badge>
        </CardTitle>
        <p className="text-white/90 text-sm">{plan.description}</p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Uso de Profissionais */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Profissionais</span>
            </div>
            <span className={`text-sm font-medium ${isOverLimit('profissionais') ? 'text-red-600' : 'text-green-600'}`}>
              {totalProfissionais}/{plan.max_profissionais}
            </span>
          </div>
          <Progress 
            value={porcentProfissionais} 
            className="h-3"
            color={isOverLimit('profissionais') ? 'bg-red-500' : 'bg-green-500'}
          />
          {isOverLimit('profissionais') && (
            <p className="text-xs text-red-600">
              ⚠️ Limite excedido! Será cobrado valor extra.
            </p>
          )}
        </div>

        {/* Uso de Agendamentos */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Agendamentos (mês)</span>
            </div>
            <span className={`text-sm font-medium ${isOverLimit('agendamentos') ? 'text-red-600' : 'text-green-600'}`}>
              {totalAgendamentosMes}/{plan.max_agendamentos_mes}
            </span>
          </div>
          <Progress 
            value={porcentAgendamentos} 
            className="h-3"
            color={isOverLimit('agendamentos') ? 'bg-red-500' : 'bg-green-500'}
          />
          {isOverLimit('agendamentos') && (
            <p className="text-xs text-red-600">
              ⚠️ Limite excedido! Será cobrado R$ {plan.excedente_valor.toFixed(2)} por agendamento extra.
            </p>
          )}
        </div>

        {/* Recursos do Plano */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3 text-gray-700">Recursos inclusos:</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {Object.entries(plan.features || {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="font-medium">
                  {typeof value === 'boolean' ? (value ? '✅' : '❌') : value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => alert('Funcionalidade de upgrade em breve!')}
          >
            Fazer Upgrade
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1"
            onClick={() => alert('Histórico de uso em breve!')}
          >
            Ver Histórico
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
