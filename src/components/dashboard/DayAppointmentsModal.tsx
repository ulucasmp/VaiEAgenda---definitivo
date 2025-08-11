
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, User, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface Appointment {
  id: string;
  clientName: string;
  service: string;
  professional: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface DayAppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  appointments: Appointment[];
}

const DayAppointmentsModal = ({ isOpen, onClose, selectedDate, appointments }: DayAppointmentsModalProps) => {
  if (!selectedDate) return null;

  const dayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate.toDateString() === selectedDate.toDateString();
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Confirmado';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Agendamentos - {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {dayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Clock className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-500">Nenhum agendamento para este dia</p>
              <p className="text-sm text-gray-400 mt-2">
                {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  {dayAppointments.length} agendamento(s) encontrado(s)
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Total: R$ {dayAppointments.length * 50}
                </p>
              </div>
              
              {dayAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => (
                <div key={appointment.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                          {appointment.time}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {appointment.clientName}
                        </h4>
                        <p className="text-sm text-gray-700 font-medium mb-2">
                          {appointment.service}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          <span>com {appointment.professional}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`${getStatusColor(appointment.status)} border px-3 py-1`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(appointment.status)}
                          <span className="text-xs font-medium">
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                      </Badge>
                      <span className="text-sm font-semibold text-gray-900">
                        R$ 50,00
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayAppointmentsModal;
