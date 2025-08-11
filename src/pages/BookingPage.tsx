
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BookingHeader from '@/components/booking/BookingHeader';
import CompanyInfoCards from '@/components/booking/CompanyInfoCards';
import BookingForm from '@/components/booking/BookingForm';

interface Empresa {
  id: string;
  nome_negocio: string;
  tipo: string;
  telefone: string | null;
  endereco: string | null;
  slug: string;
  horarios_funcionamento?: any;
}

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

const BookingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      console.log('=== BOOKING PAGE DEBUG ===');
      console.log('BookingPage: Iniciando carregamento, slug:', slug);
      console.log('BookingPage: URL completa:', window.location.href);
      console.log('BookingPage: Path atual:', window.location.pathname);
      
      if (!slug) {
        console.error('BookingPage: Slug não fornecido');
        setNotFound(true);
        setLoading(false);
        return;
      }

      console.log('BookingPage: Buscando empresa com slug:', slug);

      try {
        // Buscar empresa pelo slug
        const { data: empresaData, error: empresaError } = await supabase
          .from('empresas')
          .select('id, nome_negocio, tipo, telefone, endereco, slug, horarios_funcionamento')
          .eq('slug', slug)
          .maybeSingle();

        console.log('BookingPage: Resultado da busca da empresa:', { empresaData, empresaError });

        if (empresaError) {
          console.error('BookingPage: Erro ao buscar empresa:', empresaError);
          toast({
            title: "Erro ao carregar dados",
            description: "Ocorreu um erro ao carregar as informações da empresa.",
            variant: "destructive",
          });
          setNotFound(true);
          setLoading(false);
          return;
        }

        if (!empresaData) {
          console.log('BookingPage: Empresa não encontrada para o slug:', slug);
          setNotFound(true);
          setLoading(false);
          return;
        }

        console.log('BookingPage: Empresa encontrada:', empresaData);
        setEmpresa(empresaData);

        // Buscar profissionais da empresa
        const { data: profissionaisData, error: profissionaisError } = await supabase
          .from('profissionais')
          .select('id, nome, especialidade')
          .eq('empresa_id', empresaData.id)
          .eq('ativo', true);

        if (profissionaisData && !profissionaisError) {
          setProfessionals(profissionaisData.map(prof => ({
            id: prof.id,
            name: prof.nome,
            specialty: prof.especialidade
          })));
        } else if (profissionaisError) {
          console.error('BookingPage: Erro ao buscar profissionais:', profissionaisError);
        }

        // Buscar serviços da empresa
        const { data: servicosData, error: servicosError } = await supabase
          .from('servicos')
          .select('id, nome, preco, duracao_em_minutos')
          .eq('empresa_id', empresaData.id)
          .eq('ativo', true);

        if (servicosData && !servicosError) {
          setServices(servicosData.map(servico => ({
            id: servico.id,
            name: servico.nome,
            price: Number(servico.preco),
            duration: servico.duracao_em_minutos
          })));
        } else if (servicosError) {
          console.error('BookingPage: Erro ao buscar serviços:', servicosError);
        }

      } catch (error) {
        console.error('BookingPage: Erro geral ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro inesperado ao carregar as informações da empresa.",
          variant: "destructive",
        });
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [slug, toast]);

  // Horários disponíveis baseados na configuração da empresa e bloqueios
  const getAvailableTimes = async (selectedDate?: Date): Promise<string[]> => {
    if (!empresa?.horarios_funcionamento || !selectedDate) {
      return [];
    }
    
    const module = await import('@/utils/timeUtils');
    const allTimes = module.generateAvailableTimes(empresa.horarios_funcionamento, selectedDate);
    
    // Buscar bloqueios e agendamentos em uma única consulta otimizada
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    
    try {
      const [bloqueiosResult, agendamentosResult] = await Promise.all([
        supabase
          .from('bloqueios')
          .select('hora_inicio, hora_fim')
          .eq('empresa_id', empresa.id)
          .eq('data', selectedDateStr),
        supabase
          .from('agendamentos')
          .select('horario')
          .eq('empresa_id', empresa.id)
          .eq('data_agendamento', selectedDateStr)
          .eq('status', 'agendado - pendente de confirmação')
      ]);

      if (bloqueiosResult.error) {
        console.error('Erro ao buscar bloqueios:', bloqueiosResult.error);
      }
      
      if (agendamentosResult.error) {
        console.error('Erro ao buscar agendamentos:', agendamentosResult.error);
      }

      const bloqueios = bloqueiosResult.data || [];
      const agendamentos = agendamentosResult.data || [];

      // Filtrar horários que estão bloqueados ou ocupados
      const availableTimes = allTimes.filter(time => {
        const timeWithSeconds = time + ':00';
        
        // Verificar se o horário está em algum bloqueio
        const isBlocked = bloqueios.some(bloqueio => {
          return timeWithSeconds >= bloqueio.hora_inicio && timeWithSeconds < bloqueio.hora_fim;
        });
        
        // Verificar se já tem agendamento
        const isBooked = agendamentos.some(agendamento => agendamento.horario === timeWithSeconds);
        
        return !isBlocked && !isBooked;
      });

      return availableTimes;
    } catch (error) {
      console.error('Erro ao buscar disponibilidade:', error);
      return allTimes; // Fallback para todos os horários em caso de erro
    }
  };

  if (loading) {
    console.log('BookingPage: Renderizando estado de loading, slug:', slug);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando informações...</p>
          <p className="text-sm text-gray-500 mt-2">Buscando empresa: {slug}</p>
          <p className="text-xs text-gray-400 mt-1">URL: {window.location.href}</p>
        </div>
      </div>
    );
  }

  if (notFound || !empresa) {
    return <Navigate to="/404" replace />;
  }

  const companySettings = {
    name: empresa.nome_negocio,
    type: empresa.tipo,
    phone: empresa.telefone || '',
    address: empresa.endereco || '',
    logo: '',
    businessPhoto: null,
    workingHours: empresa.horarios_funcionamento || {
      segunda: { active: true, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
      terca: { active: true, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
      quarta: { active: true, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
      quinta: { active: true, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
      sexta: { active: true, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
      sabado: { active: false, shifts: [] },
      domingo: { active: false, shifts: [] }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <BookingHeader companySettings={companySettings} />
        
        <CompanyInfoCards companySettings={companySettings} />

        <BookingForm 
          empresa={empresa}
          services={services}
          professionals={professionals}
          getAvailableTimes={getAvailableTimes}
        />
      </div>
    </div>
  );
};

export default BookingPage;
