-- Corrigir política de leitura pública para serviços
-- A política atual só permite leitura quando ativo=true, mas não considera que a consulta
-- já filtra por empresa_id e ativo=true na aplicação

-- Remover política restritiva atual
DROP POLICY IF EXISTS "Permitir leitura pública de serviços para agendamento" ON public.servicos;

-- Criar nova política que permite leitura pública de serviços ativos
CREATE POLICY "Permitir leitura pública de serviços ativos" 
ON public.servicos 
FOR SELECT 
USING (ativo = true);

-- Verificar se a política para profissionais também está correta
DROP POLICY IF EXISTS "Permitir leitura pública de profissionais para agendamento" ON public.profissionais;

-- Criar política para permitir leitura pública de profissionais ativos
CREATE POLICY "Permitir leitura pública de profissionais ativos" 
ON public.profissionais 
FOR SELECT 
USING (ativo = true);