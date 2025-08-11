
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Servico {
  id: string;
  empresa_id: string;
  nome: string;
  preco: number;
  duracao_em_minutos: number;
  ativo: boolean;
  created_at: string;
}

export const useServicos = (empresaId?: string) => {
  const { user } = useAuth();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServicos = async () => {
    if (!empresaId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar serviços:', error);
      } else {
        setServicos(data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const addServico = async (servicoData: Omit<Servico, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('servicos')
      .insert([servicoData])
      .select()
      .single();

    if (data && !error) {
      setServicos(prev => [...prev, data]);
      return { data, error: null };
    }

    return { data: null, error };
  };

  const updateServico = async (id: string, updates: Partial<Servico>) => {
    const { data, error } = await supabase
      .from('servicos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (data && !error) {
      setServicos(prev => 
        prev.map(servico => servico.id === id ? { ...servico, ...data } : servico)
      );
      return { data, error: null };
    }

    return { data: null, error };
  };

  const deleteServico = async (id: string) => {
    const { error } = await supabase
      .from('servicos')
      .delete()
      .eq('id', id);

    if (!error) {
      setServicos(prev => prev.filter(servico => servico.id !== id));
    }

    return { error };
  };

  useEffect(() => {
    fetchServicos();
  }, [empresaId]);

  return {
    servicos,
    loading,
    addServico,
    updateServico,
    deleteServico,
    refetch: fetchServicos,
  };
};
