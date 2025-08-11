
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import WeeklySummary from './WeeklySummary';
import BookingLinkCard from './BookingLinkCard';
import AppointmentsList from './AppointmentsList';
import DayAppointmentsModal from './DayAppointmentsModal';
import { useEmpresa } from '@/hooks/useEmpresa';

interface Professional {
  id: string;
  name: string;
  specialty: string;
  active: boolean;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  active: boolean;
}

// Standardized Appointment interface
interface Appointment {
  id: string;
  clientName: string;
  service: string;
  professional: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface CompanyData {
  name: string;
  type: string;
  phone: string;
  address: string;
}

interface OverviewTabProps {
  companyData: CompanyData;
  professionals: Professional[];
  services: Service[];
  appointments: Appointment[];
}

const OverviewTab = ({ companyData, professionals, services, appointments }: OverviewTabProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { empresa } = useEmpresa();

  const activeProfessionals = professionals.filter(p => p.active);
  const activeServices = services.filter(s => s.active);
  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toDateString();
    return new Date(apt.date).toDateString() === today;
  });

  // Calculate stats for StatsCards
  const todayStats = {
    agendamentos: todayAppointments.length,
    receita: todayAppointments.length * 75, // Valor médio estimado
    disponivel: Math.max(0, 10 - todayAppointments.length),
    cancelados: appointments.filter(apt => apt.status === 'cancelled').length
  };

  // Convert appointments to format expected by AppointmentsList
  const appointmentsForList = appointments.map(apt => ({
    time: apt.time,
    client: apt.clientName,
    service: apt.service,
    professional: apt.professional,
    status: apt.status === 'confirmed' ? 'confirmado' as const : 
           apt.status === 'pending' ? 'pendente' as const : 'cancelado' as const
  }));

  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <TabsContent value="overview" className="space-y-6">
      {/* Mobile: BookingLinkCard primeiro */}
      <div className="block lg:hidden">
        <BookingLinkCard companyName={companyData.name} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Stats cards moved here for better layout */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Dia</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stats cards inline to avoid component mismatch */}
              <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Agendamentos</p>
                    <p className="text-2xl font-bold text-blue-600">{todayStats.agendamentos}</p>
                    <p className="text-xs text-gray-500">hoje</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Receita do Dia</p>
                    <p className="text-2xl font-bold text-green-600">R$ {todayStats.receita}</p>
                    <p className="text-xs text-gray-500">faturamento</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Horários Livres</p>
                    <p className="text-2xl font-bold text-blue-500">{todayStats.disponivel}</p>
                    <p className="text-xs text-gray-500">disponíveis hoje</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cancelamentos</p>
                    <p className="text-2xl font-bold text-red-500">{todayStats.cancelados}</p>
                    <p className="text-xs text-gray-500">hoje</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Próximos Agendamentos antes do Resumo da Semana */}
          <AppointmentsList empresaId={empresa?.id} />
          
          <WeeklySummary appointments={appointments} onDaySelect={handleDaySelect} />
        </div>
        
        <div className="space-y-6">
          {/* Desktop: BookingLinkCard na sidebar */}
          <div className="hidden lg:block">
            <BookingLinkCard companyName={companyData.name} />
          </div>
          
          {/* Company Quick Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Informações da Empresa</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nome:</p>
                <p className="font-medium">{companyData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo:</p>
                <p className="font-medium">{companyData.type}</p>
              </div>
              {companyData.phone && (
                <div>
                  <p className="text-sm text-gray-600">Telefone:</p>
                  <p className="font-medium">{companyData.phone}</p>
                </div>
              )}
              {companyData.address && (
                <div>
                  <p className="text-sm text-gray-600">Endereço:</p>
                  <p className="font-medium">{companyData.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Resumo Rápido</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Profissionais Ativos:</span>
                <span className="font-semibold">{activeProfessionals.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Serviços Disponíveis:</span>
                <span className="font-semibold">{activeServices.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Agendamentos Hoje:</span>
                <span className="font-semibold">{todayAppointments.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para mostrar agendamentos do dia */}
      <DayAppointmentsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        appointments={appointments}
      />
    </TabsContent>
  );
};

export default OverviewTab;
