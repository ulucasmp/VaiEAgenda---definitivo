-- Adicionar coluna link_agendamento na tabela agendamentos
ALTER TABLE public.agendamentos 
ADD COLUMN link_agendamento text;

-- Criar função para gerar o link de agendamento
CREATE OR REPLACE FUNCTION public.generate_link_agendamento()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  empresa_nome text;
BEGIN
  -- Buscar o nome da empresa
  SELECT nome_negocio INTO empresa_nome
  FROM public.empresas 
  WHERE id = NEW.empresa_id;
  
  -- Gerar o link apenas se ainda não existir
  IF NEW.link_agendamento IS NULL THEN
    NEW.link_agendamento := 'https://vaiagenda.vercel.app/agendamento?empresa=' || 
                           encode(empresa_nome::bytea, 'base64') || 
                           '&id=' || NEW.id::text;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Criar trigger para gerar o link automaticamente
CREATE TRIGGER trigger_generate_link_agendamento
  BEFORE INSERT OR UPDATE ON public.agendamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_link_agendamento();

-- Atualizar registros existentes para gerar os links
UPDATE public.agendamentos 
SET link_agendamento = 'https://vaiagenda.vercel.app/agendamento?empresa=' || 
                      encode((SELECT nome_negocio FROM public.empresas WHERE id = agendamentos.empresa_id)::bytea, 'base64') || 
                      '&id=' || agendamentos.id::text
WHERE link_agendamento IS NULL;

-- Tornar a coluna obrigatória após popular os dados existentes
ALTER TABLE public.agendamentos 
ALTER COLUMN link_agendamento SET NOT NULL;