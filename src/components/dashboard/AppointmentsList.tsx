
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User, Clock, CheckCircle } from 'lucide-react';

interface Appointment {
  id: string;
  data_agendamento: string;
  horario: string;
  cliente_nome: string;
  servico_nome?: string;
  profissional_nome?: string;
  status: string;
  servico_preco?: number;
  servico_duracao?: number;
}

interface AppointmentsListProps {
  empresaId?: string;
}

const AppointmentsList = ({ empresaId }: AppointmentsListProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!empresaId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('agendamentos')
          .select(`
            id,
            data_agendamento,
            horario,
            cliente_nome,
            status,
            servicos:servico_id(nome, preco, duracao_em_minutos),
            profissionais:profissional_id(nome)
          `)
          .eq('empresa_id', empresaId)
          .gte('data_agendamento', new Date().toISOString().split('T')[0])
          .order('data_agendamento', { ascending: true })
          .order('horario', { ascending: true })
          .limit(10);

        if (error) {
          console.error('Erro ao buscar agendamentos:', error);
        } else {
          const formattedAppointments = data?.map(appointment => ({
            id: appointment.id,
            data_agendamento: appointment.data_agendamento,
            horario: appointment.horario,
            cliente_nome: appointment.cliente_nome,
            servico_nome: appointment.servicos?.nome || 'Serviço não informado',
            profissional_nome: appointment.profissionais?.nome || 'Profissional não informado',
            status: appointment.status || 'pendente',
            servico_preco: appointment.servicos?.preco || 0,
            servico_duracao: appointment.servicos?.duracao_em_minutos || 0
          })) || [];
          
          setAppointments(formattedAppointments);
        }
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [empresaId]);

  const getStatusBadge = (status: string) => {
    const isConfirmed = status.toLowerCase().includes('confirmado');
    
    if (isConfirmed) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 text-xs px-2 py-1">
          <CheckCircle className="w-2.5 h-2.5 mr-1" />
          Confirmado
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs px-2 py-1">
        Pendente
      </Badge>
    );
  };

  const formatAppointmentInfo = (appointment: Appointment) => {
    try {
      const date = new Date(appointment.data_agendamento + 'T00:00:00');
      const dayOfWeek = format(date, 'eee', { locale: ptBR }).substring(0, 3);
      const formattedDate = format(date, 'dd/MM/yyyy', { locale: ptBR });
      const time = appointment.horario.substring(0, 5); // Remove segundos se houver
      
      return {
        dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
        formattedDate,
        time,
        fullDateString: `(${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}, ${formattedDate})`
      };
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return {
        dayOfWeek: '---',
        formattedDate: '00/00/0000',
        time: '00:00',
        fullDateString: '(---, 00/00/0000)'
      };
    }
  };

  const formatStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'agendado - pendente de confirmação':
        return 'Pendente';
      case 'confirmado':
        return 'Confirmado';
      case 'cancelado':
        return 'Cancelado';
      case 'reagendado':
        return 'Reagendado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Card className="mb-8 border-blue-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Próximos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 border-blue-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">Próximos Agendamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {appointments.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">Nenhum agendamento próximo encontrado.</p>
            </div>
          ) : (
            appointments.map((appointment) => {
              const { time, fullDateString } = formatAppointmentInfo(appointment);
              
              return (
                <div key={appointment.id} className="p-3 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base truncate">
                        {appointment.cliente_nome}
                      </h3>
                      <p className="text-gray-700 text-sm font-medium truncate">
                        {appointment.servico_nome}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {fullDateString}
                      </p>
                    </div>
                    <div className="text-right ml-3">
                      <div className="text-green-600 font-bold text-lg">
                        {time}
                      </div>
                      {appointment.servico_preco > 0 && (
                        <div className="text-gray-700 font-semibold text-sm">
                          R$ {appointment.servico_preco.toFixed(2).replace('.', ',')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-gray-600 text-xs min-w-0">
                      <div className="flex items-center gap-1 truncate">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{appointment.profissional_nome}</span>
                      </div>
                      {appointment.servico_duracao > 0 && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          <span>{appointment.servico_duracao}min</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-2 flex-shrink-0">
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsList;
