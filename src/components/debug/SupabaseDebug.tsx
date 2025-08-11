
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SupabaseDebug = () => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      // Teste 1: Listar todas as empresas
      console.log('Testando conexão com Supabase...');
      const { data: allEmpresas, error: allError } = await supabase
        .from('empresas')
        .select('id, nome_negocio, slug')
        .limit(10);

      console.log('Todas as empresas:', { allEmpresas, allError });

      // Teste 2: Buscar uma empresa específica por slug (substitua pelo slug real)
      const testSlug = 'salao-beleza-estilo'; // exemplo
      const { data: empresaBySlug, error: slugError } = await supabase
        .from('empresas')
        .select('*')
        .eq('slug', testSlug)
        .single();

      console.log(`Empresa com slug '${testSlug}':`, { empresaBySlug, slugError });

      // Teste 3: Verificar política RLS
      const { data: rlsTest, error: rlsError } = await supabase
        .from('empresas')
        .select('id, nome_negocio, slug')
        .eq('slug', testSlug);

      console.log('Teste RLS:', { rlsTest, rlsError });

      setResults({
        allEmpresas: { data: allEmpresas, error: allError },
        empresaBySlug: { data: empresaBySlug, error: slugError },
        rlsTest: { data: rlsTest, error: rlsError }
      });
    } catch (error) {
      console.error('Erro no teste:', error);
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Debug Supabase</h2>
      
      <button 
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testando...' : 'Testar Conexão'}
      </button>

      {results && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Resultados:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SupabaseDebug;
