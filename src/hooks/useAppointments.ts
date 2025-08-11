import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useBloqueios } from './useBloqueios';

interface Appointment {
  id: string;
  cliente_nome: string;
  cliente_telefone: string;
  cliente_email: string | null;
  data_agendamento: string;
  horario: string;
  status: string;
  servico: {
    nome: string;
    preco: number;
  } | null;
  profissional: {
    nome: string;
  } | null;
}

export const useAppointments = (empresaId?: string) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { isTimeBlocked } = useBloqueios(empresaId);

  const fetchAppointments = async () => {
    if (!user && !empresaId) return;

    try {
      let query = supabase
        .from('agendamentos')
        .select(`
          id,
          cliente_nome,
          cliente_telefone,
          cliente_email,
          data_agendamento,
          horario,
          status,
          servicos:servico_id (nome, preco),
          profissionais:profissional_id (nome)
        `)
        .order('data_agendamento', { ascending: true })
        .order('horario', { ascending: true });

      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      } else if (user) {
        // Buscar agendamentos da empresa do usuário logado
        const { data: empresaData } = await supabase
          .from('empresas')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (empresaData) {
          query = query.eq('empresa_id', empresaData.id);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        return;
      }

      setAppointments(data?.map(appointment => ({
        ...appointment,
        servico: appointment.servicos,
        profissional: appointment.profissionais
      })) || []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user, empresaId]);

  // Buscar agendamentos para uma data específica
  const getAppointmentsByDate = (date: Date): Appointment[] => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(
      appointment => appointment.data_agendamento === dateString
    );
  };

  // Contar agendamentos por data
  const getAppointmentCountByDate = (date: Date): number => {
    return getAppointmentsByDate(date).length;
  };

  // Verificar se um horário está ocupado
  const isTimeBooked = (date: Date, time: string, professionalId?: string): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.some(appointment => 
      appointment.data_agendamento === dateString &&
      appointment.horario === time + ':00' &&
      appointment.status === 'confirmado' &&
      (!professionalId || appointment.profissional?.nome === professionalId)
    );
  };

  // Verificar se um horário está disponível (não bloqueado e não agendado)
  const isTimeAvailable = (date: Date, time: string, professionalId?: string): boolean => {
    const timeString = time.includes(':') ? time : time + ':00';
    const endTime = new Date(`2000-01-01 ${timeString}`);
    endTime.setHours(endTime.getHours() + 1); // Assumindo 1 hora de duração
    const endTimeString = endTime.toTimeString().slice(0, 5);
    
    // Verifica se não está bloqueado nem agendado
    return !isTimeBlocked(date, time, endTimeString) && !isTimeBooked(date, time, professionalId);
  };

  return {
    appointments,
    loading,
    getAppointmentsByDate,
    getAppointmentCountByDate,
    isTimeBooked,
    isTimeAvailable,
    refetch: fetchAppointments
  };
};