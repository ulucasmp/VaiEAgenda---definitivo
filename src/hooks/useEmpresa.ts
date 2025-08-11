
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Empresa {
  id: string;
  nome_negocio: string;
  tipo: string;
  telefone: string | null;
  endereco: string | null;
  slug: string | null;
  link_agendamento: string | null;
  horarios_funcionamento?: any;
  created_at: string;
}

interface Profissional {
  id: string;
  empresa_id: string;
  nome: string;
  especialidade: string;
  horarios_disponiveis: any;
  ativo: boolean;
  created_at: string;
}

export const useEmpresa = () => {
  const { user } = useAuth();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmpresa = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('owner_id', user.id)
      .single();

    if (data && !error) {
      setEmpresa(data);
      fetchProfissionais(data.id);
    }
    setLoading(false);
  };

  const fetchProfissionais = async (empresaId: string) => {
    const { data, error } = await supabase
      .from('profissionais')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: true });

    if (data && !error) {
      setProfissionais(data);
    }
  };

  const addProfissional = async (profissionalData: Omit<Profissional, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('profissionais')
      .insert([profissionalData])
      .select()
      .single();

    if (data && !error) {
      setProfissionais(prev => [...prev, data]);
      return { data, error: null };
    }

    return { data: null, error };
  };

  const updateProfissional = async (id: string, updates: Partial<Profissional>) => {
    const { data, error } = await supabase
      .from('profissionais')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (data && !error) {
      setProfissionais(prev => 
        prev.map(prof => prof.id === id ? { ...prof, ...data } : prof)
      );
      return { data, error: null };
    }

    return { data: null, error };
  };

  const deleteProfissional = async (id: string) => {
    const { error } = await supabase
      .from('profissionais')
      .delete()
      .eq('id', id);

    if (!error) {
      setProfissionais(prev => prev.filter(prof => prof.id !== id));
    }

    return { error };
  };

  useEffect(() => {
    fetchEmpresa();
  }, [user]);

  return {
    empresa,
    profissionais,
    loading,
    addProfissional,
    updateProfissional,
    deleteProfissional,
    refetch: fetchEmpresa,
  };
};
