import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useBloqueios } from './useBloqueios';

interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  client_email: string | null;
  scheduled_at: string;
  status: string;
  service: {
    name: string;
    price: number;
  } | null;
  professional: {
    name: string;
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
        .from('appointments')
        .select(`
          id,
          client_name,
          client_phone,
          client_email,
          scheduled_at,
          status,
          services:service_id (name, price),
          professionals:professional_id (name)
        `)
        .order('scheduled_at', { ascending: true });

      if (empresaId) {
        query = query.eq('company_id', empresaId);
      } else if (user) {
        // Buscar agendamentos da empresa do usuário logado
        const { data: empresaData } = await supabase
          .from('companies')
          .select('id')
          .eq('id', user.id)
          .single();

        if (empresaData) {
          query = query.eq('company_id', empresaData.id);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        return;
      }

      setAppointments(data?.map(appointment => ({
        ...appointment,
        service: appointment.services,
        professional: appointment.professionals
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
      appointment => appointment.scheduled_at.split('T')[0] === dateString
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
      appointment.scheduled_at.split('T')[0] === dateString &&
      appointment.scheduled_at.includes(time) &&
      appointment.status === 'confirmed' &&
      (!professionalId || appointment.professional?.name === professionalId)
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