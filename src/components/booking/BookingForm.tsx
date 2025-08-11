
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle } from 'lucide-react';
import ServiceSelector from './ServiceSelector';
import ProfessionalSelector from './ProfessionalSelector';
import DateTimeSelector from './DateTimeSelector';
import SecureClientInfoForm from './SecureClientInfoForm';
import { useSecureBooking } from '@/hooks/useSecureBooking';
import { nameSchema, phoneSchema, emailSchema } from '@/utils/validation';

interface Professional {
  id: string;
  name: string;
  specialty: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface Empresa {
  id: string;
  nome_negocio: string;
  tipo: string;
  telefone: string | null;
  endereco: string | null;
  slug: string;
  horarios_funcionamento?: any;
}

interface BookingFormProps {
  empresa: Empresa;
  services: Service[];
  professionals: Professional[];
  getAvailableTimes: (selectedDate?: Date) => Promise<string[]>;
}

const BookingForm = ({ empresa, services, professionals, getAvailableTimes }: BookingFormProps) => {
  const { createBooking, isLoading } = useSecureBooking();
  const [selectedService, setSelectedService] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [clientName, setClientName] = useState('');
  
  // Atualizar horários disponíveis quando a data muda
  useEffect(() => {
    if (selectedDate) {
      getAvailableTimes(selectedDate).then(times => {
        setAvailableTimes(times);
        // Limpar horário selecionado se não estiver mais disponível
        if (selectedTime && !times.includes(selectedTime)) {
          setSelectedTime('');
        }
      });
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate]); // Removido getAvailableTimes e selectedTime das dependências
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    try {
      nameSchema.parse(clientName);
    } catch (error: any) {
      newErrors.name = error.errors[0]?.message || 'Nome inválido';
    }

    try {
      phoneSchema.parse(clientPhone);
    } catch (error: any) {
      newErrors.phone = error.errors[0]?.message || 'Telefone inválido';
    }

    if (clientEmail) {
      try {
        emailSchema.parse(clientEmail);
      } catch (error: any) {
        newErrors.email = error.errors[0]?.message || 'Email inválido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const needsProfessional = professionals.length > 0;
    if (!selectedService || (needsProfessional && !selectedProfessional) || !selectedDate || !selectedTime || !clientName || !clientPhone) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const success = await createBooking({
      clientName,
      clientPhone,
      clientEmail,
      selectedService,
      selectedProfessional: professionals.length > 0 ? selectedProfessional : null,
      selectedDate,
      selectedTime,
      empresaId: empresa.id
    });

    if (success.success) {
      // Clear form on success
      setSelectedService('');
      setSelectedProfessional('');
      setSelectedDate(undefined);
      setSelectedTime('');
      setClientName('');
      setClientPhone('');
      setClientEmail('');
      setErrors({});
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedProfessionalData = professionals.find(p => p.id === selectedProfessional);

  return (
    <Card className="border-blue-100 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardTitle className="text-xl text-gray-900 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Agende seu Horário
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seletor de Serviços */}
          {services.length > 0 ? (
            <ServiceSelector
              services={services}
              selectedService={selectedService}
              onServiceSelect={setSelectedService}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Esta empresa ainda não cadastrou serviços disponíveis.</p>
            </div>
          )}

          {/* Seletor de Profissionais */}
          {professionals.length > 0 && selectedService && (
            <ProfessionalSelector
              professionals={professionals}
              selectedProfessional={selectedProfessional}
              onProfessionalSelect={setSelectedProfessional}
            />
          )}

          {/* Seletor de Data e Horário */}
          {selectedService && (professionals.length === 0 || selectedProfessional) && (
            <DateTimeSelector
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              availableTimes={availableTimes}
              onDateSelect={setSelectedDate}
              onTimeSelect={setSelectedTime}
            />
          )}

          {/* Informações do Cliente */}
          {selectedService && (professionals.length === 0 || selectedProfessional) && selectedDate && selectedTime && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Suas Informações
              </h3>
              <SecureClientInfoForm
                clientName={clientName}
                clientPhone={clientPhone}
                clientEmail={clientEmail}
                onNameChange={setClientName}
                onPhoneChange={setClientPhone}
                onEmailChange={setClientEmail}
                errors={errors}
              />
            </div>
          )}

          {/* Resumo do Agendamento */}
          {selectedService && (professionals.length === 0 || selectedProfessional) && selectedDate && selectedTime && clientName && clientPhone && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3">Resumo do Agendamento:</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Serviço:</strong> {selectedServiceData?.name} - R$ {selectedServiceData?.price}</p>
                {selectedProfessionalData && (
                  <p><strong>Profissional:</strong> {selectedProfessionalData.name} ({selectedProfessionalData.specialty})</p>
                )}
                <p><strong>Data:</strong> {selectedDate.toLocaleDateString('pt-BR')}</p>
                <p><strong>Horário:</strong> {selectedTime}</p>
                <p><strong>Duração:</strong> {selectedServiceData?.duration} minutos</p>
                <p><strong>Cliente:</strong> {clientName}</p>
                <p><strong>Telefone:</strong> {clientPhone}</p>
              </div>
            </div>
          )}

          {/* Botão de Confirmar */}
          {selectedService && (professionals.length === 0 || selectedProfessional) && selectedDate && selectedTime && clientName && clientPhone && (
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Confirmando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirmar Agendamento
                </>
              )}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
