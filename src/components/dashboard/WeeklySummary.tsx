
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Appointment {
  id: string;
  clientName: string;
  service: string;
  professional: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface WeeklySummaryProps {
  appointments: Appointment[];
  onDaySelect?: (date: Date) => void;
}

const WeeklySummary = ({ appointments, onDaySelect }: WeeklySummaryProps) => {
  // Generate weekly data from appointments
  const generateWeeklyData = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const today = new Date();
    
    return days.map((day, index) => {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() - today.getDay() + index);
      
      const dayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.toDateString() === dayDate.toDateString();
      });

      return {
        day,
        date: dayDate,
        agendamentos: dayAppointments.length,
        receita: dayAppointments.length * 50, // Valor médio estimado
        disponivel: Math.max(0, 8 - dayAppointments.length)
      };
    });
  };

  const weeklyData = generateWeeklyData();

  const getDayDate = (dayIndex: number) => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = dayIndex - currentDay;
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + diff);
    return dayDate.getDate();
  };

  const handleDayClick = (dayIndex: number) => {
    const dayData = weeklyData[dayIndex];
    if (onDaySelect && dayData) {
      onDaySelect(dayData.date);
    }
  };

  return (
    <Card className="mb-8 border-blue-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">Resumo da Semana</CardTitle>
        <p className="text-sm text-gray-600">Clique em um dia para ver os agendamentos detalhados</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {weeklyData.map((day, index) => (
            <div key={`${day.day}-${index}`} className="text-center">
              <button 
                className="w-full bg-white border-2 border-gray-100 hover:border-blue-300 p-3 rounded-xl transition-all hover:shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={() => handleDayClick(index)}
                type="button"
              >
                <div className="mb-3">
                  <p className="font-semibold text-sm text-gray-700">{day.day}</p>
                  <p className="text-xs text-gray-500 font-medium">Dia {getDayDate(index)}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-blue-50 rounded-lg p-2 hover:bg-blue-100 transition-colors">
                    <p className="text-xl font-bold text-blue-600">{day.agendamentos}</p>
                    <p className="text-xs text-blue-600">agendados</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-2 hover:bg-green-100 transition-colors">
                    <p className="text-sm font-semibold text-green-600">R$ {day.receita}</p>
                    <p className="text-xs text-green-600">receita</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-1">
                    <p className="text-xs text-gray-500">{day.disponivel} livres</p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>💡 Dica: Clique nos cartões para ver o cronograma detalhado de cada dia</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySummary;
