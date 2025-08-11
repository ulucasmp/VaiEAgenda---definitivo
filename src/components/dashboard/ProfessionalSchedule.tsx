
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Clock, User } from 'lucide-react';

interface ProfessionalScheduleProps {
  professionalName: string;
  onClose: () => void;
}

const ProfessionalSchedule = ({ professionalName, onClose }: ProfessionalScheduleProps) => {
  // Dados mockados para demonstração
  const appointments = [
    { time: '09:00', client: 'Maria Silva', service: 'Corte + Escova', status: 'confirmado' },
    { time: '10:30', client: 'João Santos', service: 'Corte Masculino', status: 'confirmado' },
    { time: '14:00', client: 'Ana Costa', service: 'Coloração', status: 'pendente' },
    { time: '16:00', client: 'Pedro Lima', service: 'Barba', status: 'confirmado' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="w-5 h-5" />
            Agenda de {professionalName}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Hoje - {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</h3>
          </div>
          
          <div className="space-y-3">
            {appointments.map((appointment, index) => (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-blue-600">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{appointment.time}</span>
                      </div>
                      <div>
                        <p className="font-medium">{appointment.client}</p>
                        <p className="text-sm text-gray-600">{appointment.service}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {appointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum agendamento para hoje</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSchedule;
