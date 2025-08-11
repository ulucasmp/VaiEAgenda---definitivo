
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { bookingSchema, validateBusinessHours } from '@/utils/validation';
import { isTimeWithinBusinessHours } from '@/utils/timeUtils';

interface BookingData {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  selectedService: string;
  selectedProfessional: string | null;
  selectedDate: Date;
  selectedTime: string;
  empresaId: string;
}

export const useSecureBooking = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitCount, setRateLimitCount] = useState(0);
  const [lastBookingTime, setLastBookingTime] = useState<number>(0);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const timeSinceLastBooking = now - lastBookingTime;
    
    // Reset counter if more than 10 minutes have passed
    if (timeSinceLastBooking > 10 * 60 * 1000) {
      setRateLimitCount(0);
    }
    
    // Allow maximum 3 bookings per 10 minutes
    if (rateLimitCount >= 3 && timeSinceLastBooking < 10 * 60 * 1000) {
      return false;
    }
    
    return true;
  };

  const createBooking = async (bookingData: BookingData) => {
    if (!checkRateLimit()) {
      toast({
        title: "Muitas tentativas",
        description: "Aguarde alguns minutos antes de tentar novamente.",
        variant: "destructive",
      });
      return { success: false };
    }

    setIsLoading(true);

    try {
      // Validate input data
      const validatedData = bookingSchema.parse({
        clientName: bookingData.clientName,
        clientPhone: bookingData.clientPhone,
        clientEmail: bookingData.clientEmail || undefined,
        selectedService: bookingData.selectedService,
        selectedProfessional: bookingData.selectedProfessional,
        selectedDate: bookingData.selectedDate,
        selectedTime: bookingData.selectedTime
      });

      // Buscar horários de funcionamento da empresa
      const { data: empresaData } = await supabase
        .from('empresas')
        .select('horarios_funcionamento')
        .eq('id', bookingData.empresaId)
        .single();

      if (empresaData?.horarios_funcionamento) {
        const isValidTime = isTimeWithinBusinessHours(
          empresaData.horarios_funcionamento as any,
          validatedData.selectedDate,
          validatedData.selectedTime
        );

        if (!isValidTime) {
          toast({
            title: "Horário inválido",
            description: "Este horário não está disponível para agendamento.",
            variant: "destructive",
          });
          return { success: false };
        }
      }

      // Verificar se o horário está bloqueado
      const selectedDateStr = validatedData.selectedDate.toISOString().split('T')[0];
      const selectedTimeStr = validatedData.selectedTime + ':00';

      const { data: bloqueios, error: bloqueioError } = await supabase
        .from('bloqueios')
        .select('hora_inicio, hora_fim')
        .eq('empresa_id', bookingData.empresaId)
        .eq('data', selectedDateStr);

      if (bloqueioError) {
        throw new Error('Erro ao verificar bloqueios de horário');
      }

      // Verificar se o horário está em algum bloqueio
      const isBlocked = bloqueios?.some(bloqueio => {
        return selectedTimeStr >= bloqueio.hora_inicio && selectedTimeStr < bloqueio.hora_fim;
      });

      if (isBlocked) {
        toast({
          title: "Horário bloqueado",
          description: "Este horário não está disponível para agendamento.",
          variant: "destructive",
        });
        return { success: false };
      }

      // Check for existing booking conflicts
      // Se há profissional selecionado, verificar conflitos por profissional
      // Se não há profissional, verificar conflitos por serviço/empresa
      const conflictQuery = validatedData.selectedProfessional 
        ? supabase
            .from('agendamentos')
            .select('id')
            .eq('profissional_id', validatedData.selectedProfessional)
            .eq('data_agendamento', selectedDateStr)
            .eq('horario', selectedTimeStr)
        : supabase
            .from('agendamentos')
            .select('id')
            .eq('empresa_id', bookingData.empresaId)
            .eq('servico_id', validatedData.selectedService)
            .eq('data_agendamento', selectedDateStr)
            .eq('horario', selectedTimeStr)
            .is('profissional_id', null);

      const { data: existingBookings, error: conflictError } = await conflictQuery;

      if (conflictError) {
        throw new Error('Erro ao verificar conflitos de agendamento');
      }

      if (existingBookings && existingBookings.length > 0) {
        toast({
          title: "Horário indisponível",
          description: "Este horário já foi agendado. Escolha outro horário.",
          variant: "destructive",
        });
        return { success: false };
      }

      // Create the booking
      const agendamentoData = {
        empresa_id: bookingData.empresaId,
        profissional_id: validatedData.selectedProfessional || null,
        servico_id: validatedData.selectedService,
        cliente_nome: validatedData.clientName,
        cliente_telefone: validatedData.clientPhone,
        cliente_email: validatedData.clientEmail || null,
        data_agendamento: validatedData.selectedDate.toISOString().split('T')[0],
        horario: validatedData.selectedTime + ':00',
        status: 'agendado - pendente de confirmação',
        link_agendamento: '' // O trigger gerará automaticamente
      };

      const { error } = await supabase
        .from('agendamentos')
        .insert(agendamentoData);

      if (error) {
        // Se for erro de constraint de agendamento duplicado
        if (error.code === '23505' && (
          error.message.includes('unique_professional_booking_slot') || 
          error.message.includes('unique_service_booking_slot')
        )) {
          toast({
            title: "Horário indisponível",
            description: "Este horário acabou de ser reservado. Escolha outro horário.",
            variant: "destructive",
          });
          return { success: false };
        }
        throw error;
      }

      // Update rate limiting
      setRateLimitCount(prev => prev + 1);
      setLastBookingTime(Date.now());

      toast({
        title: "Agendamento confirmado!",
        description: `Seu agendamento foi marcado para ${validatedData.selectedDate.toLocaleDateString('pt-BR')} às ${validatedData.selectedTime}.`,
      });

      return { success: true };

    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);
      
      if (error.name === 'ZodError') {
        const firstError = error.errors[0];
        toast({
          title: "Dados inválidos",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao agendar",
          description: "Ocorreu um erro ao confirmar seu agendamento. Tente novamente.",
          variant: "destructive",
        });
      }
      
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooking,
    isLoading
  };
};
