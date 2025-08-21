import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Bloqueio {
  id: string;
  company_id: string | null;
  professional_id: string | null;
  start_time: string;
  end_time: string;
  motivo?: string;
  created_at: string;
}

export const useBloqueios = (empresaId?: string) => {
  const { user } = useAuth();
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBloqueios = async () => {
    if (!user && !empresaId) return;

    try {
      let query = supabase
        .from('bloqueios')
        .select('*')
        .order('start_time', { ascending: true })
        .order('end_time', { ascending: true });

      if (empresaId) {
        query = query.eq('company_id', empresaId);
      } else if (user) {
        // Buscar bloqueios da empresa do usuário logado
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
        console.error('Erro ao buscar bloqueios:', error);
        return;
      }

      setBloqueios(data || []);
    } catch (error) {
      console.error('Erro ao buscar bloqueios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloqueios();
  }, [user, empresaId]);

  // Buscar bloqueios para uma data específica
  const getBloqueiosByDate = (date: Date): Bloqueio[] => {
    const dateString = date.toISOString().split('T')[0];
    return bloqueios.filter(bloqueio => bloqueio.start_time.split('T')[0] === dateString);
  };

  // Verificar se um horário está bloqueado
  const isTimeBlocked = (date: Date, startTime: string, endTime: string): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return bloqueios.some(bloqueio => {
      if (bloqueio.start_time.split('T')[0] !== dateString) return false;
      
      const bloqueioStart = bloqueio.start_time.split('T')[1] || bloqueio.start_time;
      const bloqueioEnd = bloqueio.end_time.split('T')[1] || bloqueio.end_time;
      
      // Verifica se há sobreposição de horários
      return (startTime < bloqueioEnd && endTime > bloqueioStart);
    });
  };

  // Criar novo bloqueio
  const createBloqueio = async (bloqueio: Omit<Bloqueio, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('bloqueios')
        .insert([bloqueio])
        .select()
        .single();

      if (error) throw error;

      setBloqueios(prev => [...prev, data]);
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar bloqueio:', error);
      return { success: false, error };
    }
  };

  // Atualizar bloqueio
  const updateBloqueio = async (id: string, updates: Partial<Bloqueio>) => {
    try {
      const { data, error } = await supabase
        .from('bloqueios')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setBloqueios(prev => prev.map(b => b.id === id ? data : b));
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar bloqueio:', error);
      return { success: false, error };
    }
  };

  // Deletar bloqueio
  const deleteBloqueio = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bloqueios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBloqueios(prev => prev.filter(b => b.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar bloqueio:', error);
      return { success: false, error };
    }
  };

  return {
    bloqueios,
    loading,
    getBloqueiosByDate,
    isTimeBlocked,
    createBloqueio,
    updateBloqueio,
    deleteBloqueio,
    refetch: fetchBloqueios
  };
};