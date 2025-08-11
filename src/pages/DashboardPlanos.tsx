import React from 'react';
import { PlanProvider } from '@/context/PlanContext';
import { PlanCard } from '@/components/dashboard/PlanCard';
import { ExcedenteModal } from '@/components/modals/ExcedenteModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Calendar, TrendingUp, Crown } from 'lucide-react';

function DashboardPlanosContent() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Crown className="w-8 h-8 text-yellow-500" />
          Meu Plano VaiEAgenda
        </h1>
        <p className="text-gray-600">
          Gerencie sua assinatura, monitore o uso e faça upgrade quando necessário
        </p>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna principal - Card do Plano */}
        <div className="lg:col-span-2">
          <PlanCard />
        </div>

        {/* Coluna lateral - Ações rápidas */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => alert('Relatórios em breve!')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Ver Relatórios
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => alert('Histórico de uso em breve!')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Histórico de Uso
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => alert('Configurações de plano em breve!')}
              >
                <Users className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              
              <Button 
                className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                onClick={() => alert('Upgrade em breve!')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Fazer Upgrade
              </Button>
            </CardContent>
          </Card>

          {/* Card de benefícios */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Benefícios do Upgrade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div>✨ Mais profissionais cadastrados</div>
                <div>📅 Mais agendamentos por mês</div>
                <div>📊 Relatórios avançados</div>
                <div>🎨 Personalização de marca</div>
                <div>📱 Integração com WhatsApp</div>
                <div>💳 Gateway de pagamentos</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal automático de excedente */}
      <ExcedenteModal />
    </div>
  );
}

export default function DashboardPlanos() {
  return (
    <PlanProvider>
      <DashboardPlanosContent />
    </PlanProvider>
  );
}
