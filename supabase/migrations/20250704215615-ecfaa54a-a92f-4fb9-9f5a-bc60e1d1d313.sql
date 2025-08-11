
-- Criar tabela empresas
CREATE TABLE public.empresas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_negocio TEXT NOT NULL,
  tipo TEXT NOT NULL,
  telefone TEXT,
  endereco TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela profissionais
CREATE TABLE public.profissionais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  especialidade TEXT NOT NULL,
  horarios_disponiveis JSONB,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profissionais ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para empresas
CREATE POLICY "Usuários podem ver suas próprias empresas" 
  ON public.empresas 
  FOR SELECT 
  USING (auth.uid() = owner_id);

CREATE POLICY "Usuários podem criar suas próprias empresas" 
  ON public.empresas 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Usuários podem atualizar suas próprias empresas" 
  ON public.empresas 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Usuários podem deletar suas próprias empresas" 
  ON public.empresas 
  FOR DELETE 
  USING (auth.uid() = owner_id);

-- Políticas RLS para profissionais
CREATE POLICY "Usuários podem ver profissionais de suas empresas" 
  ON public.profissionais 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.empresas 
    WHERE empresas.id = profissionais.empresa_id 
    AND empresas.owner_id = auth.uid()
  ));

CREATE POLICY "Usuários podem criar profissionais para suas empresas" 
  ON public.profissionais 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.empresas 
    WHERE empresas.id = profissionais.empresa_id 
    AND empresas.owner_id = auth.uid()
  ));

CREATE POLICY "Usuários podem atualizar profissionais de suas empresas" 
  ON public.profissionais 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.empresas 
    WHERE empresas.id = profissionais.empresa_id 
    AND empresas.owner_id = auth.uid()
  ));

CREATE POLICY "Usuários podem deletar profissionais de suas empresas" 
  ON public.profissionais 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.empresas 
    WHERE empresas.id = profissionais.empresa_id 
    AND empresas.owner_id = auth.uid()
  ));
