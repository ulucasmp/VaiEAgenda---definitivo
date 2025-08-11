
import React from 'react';
import { Calendar, TrendingUp, Users, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TodayStats {
  agendamentos: number;
  receita: number;
  disponivel: number;
  cancelados: number;
}

interface StatsCardsProps {
  todayStats: TodayStats;
}

const StatsCards = ({ todayStats }: StatsCardsProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Dia</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Agendamentos</p>
                <p className="text-2xl font-bold text-blue-600">{todayStats.agendamentos}</p>
                <p className="text-xs text-gray-500">hoje</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Receita do Dia</p>
                <p className="text-2xl font-bold text-green-600">R$ {todayStats.receita}</p>
                <p className="text-xs text-gray-500">faturamento</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Horários Livres</p>
                <p className="text-2xl font-bold text-blue-500">{todayStats.disponivel}</p>
                <p className="text-xs text-gray-500">disponíveis hoje</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-red-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Cancelamentos</p>
                <p className="text-2xl font-bold text-red-500">{todayStats.cancelados}</p>
                <p className="text-xs text-gray-500">hoje</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsCards;
