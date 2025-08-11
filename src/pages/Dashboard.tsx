
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEmpresa } from '@/hooks/useEmpresa';
import { useServicos } from '@/hooks/useServicos';
import { useAppointments } from '@/hooks/useAppointments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import OverviewTab from '@/components/dashboard/OverviewTab';
import CompanyTab from '@/components/dashboard/CompanyTab';
import ProfessionalsTab from '@/components/dashboard/ProfessionalsTab';
import ServicesTab from '@/components/dashboard/ServicesTab';
import CalendarTab from '@/components/dashboard/CalendarTab';
import BookingLinkCard from '@/components/dashboard/BookingLinkCard';
import StatsCards from '@/components/dashboard/StatsCards';

const Dashboard = () => {
  const { user, session, loading: authLoading } = useAuth();
  const { empresa, profissionais, loading: empresaLoading } = useEmpresa();
  const { servicos, loading: servicosLoading } = useServicos(empresa?.id);
  const { appointments, loading: appointmentsLoading } = useAppointments(empresa?.id);

  console.log('Dashboard - authLoading:', authLoading, 'user:', user?.email, 'empresaLoading:', empresaLoading, 'empresa:', empresa?.nome_negocio);

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div>Carregando...</div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user || !session) {
    console.log('Dashboard - Redirecting to /auth - no user or session');
    return <Navigate to="/auth" replace />;
  }

  // Show loading while checking empresa and its data
  if (empresaLoading || servicosLoading || appointmentsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div>Carregando dados da empresa...</div>
        </div>
      </div>
    );
  }

  // Redirect to setup if no company
  if (!empresa) {
    console.log('Dashboard - Redirecting to /empresa-setup - no empresa');
    return <Navigate to="/empresa-setup" replace />;
  }

  // Calculate today's stats from real appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.data_agendamento === today);
  const todayStats = {
    agendamentos: todayAppointments.length,
    receita: todayAppointments.reduce((total, apt) => total + (apt.servico?.preco || 0), 0),
    disponivel: Math.max(0, 12 - todayAppointments.length), // Assuming 12 slots per day
    cancelados: todayAppointments.filter(apt => apt.status === 'cancelado').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <DashboardHeader companyName={empresa.nome_negocio} />
        
        <BookingLinkCard companyName={empresa.nome_negocio} />

        <StatsCards todayStats={todayStats} />
        
        <Tabs defaultValue="overview" className="space-y-6">
          {/* Mobile-first responsive TabsList */}
          <div className="w-full">
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList className="inline-flex h-12 bg-white border border-blue-100 shadow-sm rounded-lg p-1 gap-1 w-max min-w-full">
                <TabsTrigger 
                  value="overview" 
                  className="flex-shrink-0 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-gray-600 text-sm py-2.5 px-3 sm:px-4 rounded-md font-medium transition-all whitespace-nowrap min-w-[90px] hover:bg-blue-50"
                >
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger 
                  value="calendar" 
                  className="flex-shrink-0 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-gray-600 text-sm py-2.5 px-3 sm:px-4 rounded-md font-medium transition-all whitespace-nowrap min-w-[85px] hover:bg-blue-50"
                >
                  Calendário
                </TabsTrigger>
                <TabsTrigger 
                  value="company" 
                  className="flex-shrink-0 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-gray-600 text-sm py-2.5 px-3 sm:px-4 rounded-md font-medium transition-all whitespace-nowrap min-w-[75px] hover:bg-blue-50"
                >
                  Empresa
                </TabsTrigger>
                <TabsTrigger 
                  value="services" 
                  className="flex-shrink-0 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-gray-600 text-sm py-2.5 px-3 sm:px-4 rounded-md font-medium transition-all whitespace-nowrap min-w-[75px] hover:bg-blue-50"
                >
                  Serviços
                </TabsTrigger>
                <TabsTrigger 
                  value="professionals" 
                  className="flex-shrink-0 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-gray-600 text-sm py-2.5 px-3 sm:px-4 rounded-md font-medium transition-all whitespace-nowrap min-w-[100px] hover:bg-blue-50"
                >
                  Profissionais
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <OverviewTab 
            companyData={{
              name: empresa.nome_negocio,
              type: empresa.tipo,
              phone: empresa.telefone || '',
              address: empresa.endereco || ''
            }}
            professionals={profissionais.map(prof => ({
              id: prof.id,
              name: prof.nome,
              specialty: prof.especialidade,
              active: prof.ativo
            }))}
            services={servicos.map(servico => ({
              id: servico.id,
              name: servico.nome,
              price: Number(servico.preco),
              duration: servico.duracao_em_minutos,
              active: servico.ativo
            }))}
            appointments={appointments.map(apt => ({
              id: apt.id,
              clientName: apt.cliente_nome,
              service: apt.servico?.nome || 'Serviço não especificado',
              professional: apt.profissional?.nome || 'Profissional não especificado',
              date: apt.data_agendamento,
              time: apt.horario.substring(0, 5), // Remove seconds from time
              status: apt.status === 'agendado - pendente de confirmação' ? 'pending' : 
                     apt.status === 'confirmado' ? 'confirmed' : 'cancelled'
            }))}
          />

          <CalendarTab />

          <CompanyTab />

          <ServicesTab />
          
          <ProfessionalsTab professionals={profissionais.map(prof => ({
            id: prof.id,
            name: prof.nome,
            specialty: prof.especialidade,
            phone: '',
            email: '',
            active: prof.ativo
          }))} />
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
