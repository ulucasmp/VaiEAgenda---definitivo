-- Criar tabela bloqueios para horários bloqueados
CREATE TABLE public.bloqueios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL,
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  descricao TEXT,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.bloqueios ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para bloqueios
CREATE POLICY "Usuários podem ver bloqueios de suas empresas" 
ON public.bloqueios 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM empresas 
  WHERE empresas.id = bloqueios.empresa_id 
  AND empresas.owner_id = auth.uid()
));

CREATE POLICY "Usuários podem criar bloqueios para suas empresas" 
ON public.bloqueios 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM empresas 
  WHERE empresas.id = bloqueios.empresa_id 
  AND empresas.owner_id = auth.uid()
));

CREATE POLICY "Usuários podem atualizar bloqueios de suas empresas" 
ON public.bloqueios 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM empresas 
  WHERE empresas.id = bloqueios.empresa_id 
  AND empresas.owner_id = auth.uid()
));

CREATE POLICY "Usuários podem deletar bloqueios de suas empresas" 
ON public.bloqueios 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM empresas 
  WHERE empresas.id = bloqueios.empresa_id 
  AND empresas.owner_id = auth.uid()
));

-- Índices para performance
CREATE INDEX idx_bloqueios_empresa_id ON public.bloqueios(empresa_id);
CREATE INDEX idx_bloqueios_data ON public.bloqueios(data);
CREATE INDEX idx_bloqueios_empresa_data ON public.bloqueios(empresa_id, data);