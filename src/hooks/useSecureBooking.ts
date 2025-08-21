
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
        .from('companies')
        .select('*')
        .eq('id', bookingData.empresaId)
        .single();

      // For now, skip business hours validation since it's not implemented in the companies table

      // Verificar se o horário está bloqueado
      const selectedDateStr = validatedData.selectedDate.toISOString().split('T')[0];
      const selectedDateTime = new Date(`${selectedDateStr}T${validatedData.selectedTime}:00`);

      const { data: bloqueios, error: bloqueioError } = await supabase
        .from('bloqueios')
        .select('start_time, end_time')
        .eq('company_id', bookingData.empresaId)
        .gte('start_time', selectedDateStr)
        .lt('start_time', selectedDateStr + 'T23:59:59');

      if (bloqueioError) {
        throw new Error('Erro ao verificar bloqueios de horário');
      }

      // Verificar se o horário está em algum bloqueio
      const isBlocked = bloqueios?.some(bloqueio => {
        const startTime = new Date(bloqueio.start_time);
        const endTime = new Date(bloqueio.end_time);
        return selectedDateTime >= startTime && selectedDateTime < endTime;
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
            .from('appointments')
            .select('id')
            .eq('professional_id', validatedData.selectedProfessional)
            .eq('scheduled_at', selectedDateTime.toISOString())
        : supabase
            .from('appointments')
            .select('id')
            .eq('company_id', bookingData.empresaId)
            .eq('service_id', validatedData.selectedService)
            .eq('scheduled_at', selectedDateTime.toISOString())
            .is('professional_id', null);

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
        company_id: bookingData.empresaId,
        professional_id: validatedData.selectedProfessional || null,
        service_id: validatedData.selectedService,
        client_name: validatedData.clientName,
        client_phone: validatedData.clientPhone,
        client_email: validatedData.clientEmail || null,
        scheduled_at: selectedDateTime.toISOString(),
        status: 'scheduled'
      };

      const { error } = await supabase
        .from('appointments')
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
