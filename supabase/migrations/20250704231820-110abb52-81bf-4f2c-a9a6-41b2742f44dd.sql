
-- Adicionar campo slug à tabela empresas
ALTER TABLE public.empresas ADD COLUMN slug TEXT UNIQUE;

-- Criar tabela servicos
CREATE TABLE public.servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  preco NUMERIC(10,2) NOT NULL,
  duracao_em_minutos INTEGER NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela agendamentos
CREATE TABLE public.agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
  profissional_id UUID REFERENCES public.profissionais(id) ON DELETE CASCADE,
  servico_id UUID REFERENCES public.servicos(id) ON DELETE CASCADE,
  cliente_nome TEXT NOT NULL,
  cliente_telefone TEXT NOT NULL,
  cliente_email TEXT,
  data_agendamento DATE NOT NULL,
  horario TIME NOT NULL,
  status TEXT DEFAULT 'confirmado',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para servicos
CREATE POLICY "Usuários podem ver serviços de suas empresas" 
  ON public.servicos 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.empresas 
    WHERE empresas.id = servicos.empresa_id 
    AND empresas.owner_id = auth.uid()
  ));

CREATE POLICY "Usuários podem criar serviços para suas empresas" 
  ON public.servicos 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.empresas 
    WHERE empresas.id = servicos.empresa_id 
    AND empresas.owner_id = auth.uid()
  ));

CREATE POLICY "Usuários podem atualizar serviços de suas empresas" 
  ON public.servicos 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.empresas 
    WHERE empresas.id = servicos.empresa_id 
    AND empresas.owner_id = auth.uid()
  ));

CREATE POLICY "Usuários podem deletar serviços de suas empresas" 
  ON public.servicos 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.empresas 
    WHERE empresas.id = servicos.empresa_id 
    AND empresas.owner_id = auth.uid()
  ));

-- Políticas RLS para agendamentos - Permite visualização pública por slug
CREATE POLICY "Empresários podem ver agendamentos de suas empresas" 
  ON public.agendamentos 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.empresas 
    WHERE empresas.id = agendamentos.empresa_id 
    AND empresas.owner_id = auth.uid()
  ));

CREATE POLICY "Permitir criação pública de agendamentos" 
  ON public.agendamentos 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Empresários podem atualizar agendamentos de suas empresas" 
  ON public.agendamentos 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.empresas 
    WHERE empresas.id = agendamentos.empresa_id 
    AND empresas.owner_id = auth.uid()
  ));

CREATE POLICY "Empresários podem deletar agendamentos de suas empresas" 
  ON public.agendamentos 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.empresas 
    WHERE empresas.id = agendamentos.empresa_id 
    AND empresas.owner_id = auth.uid()
  ));

-- Política para permitir leitura pública de dados necessários para agendamento
CREATE POLICY "Permitir leitura pública de empresas por slug" 
  ON public.empresas 
  FOR SELECT 
  USING (slug IS NOT NULL);

CREATE POLICY "Permitir leitura pública de profissionais para agendamento" 
  ON public.profissionais 
  FOR SELECT 
  USING (ativo = true);

CREATE POLICY "Permitir leitura pública de serviços para agendamento" 
  ON public.servicos 
  FOR SELECT 
  USING (ativo = true);
