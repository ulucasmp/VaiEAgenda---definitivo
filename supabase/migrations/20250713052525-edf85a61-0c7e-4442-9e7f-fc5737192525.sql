-- Adicionar coluna link_agendamento na tabela empresas
ALTER TABLE public.empresas 
ADD COLUMN link_agendamento TEXT;

-- Criar função para gerar link de agendamento baseado na slug da empresa
CREATE OR REPLACE FUNCTION public.generate_empresa_link_agendamento()
RETURNS TRIGGER AS $$
BEGIN
  -- Gerar o link de agendamento baseado na slug
  IF NEW.slug IS NOT NULL THEN
    NEW.link_agendamento := 'https://bbce0725-e9f7-4b45-b833-cb546ff414e3.lovableproject.com/agendamento/' || NEW.slug;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para gerar link automaticamente ao criar/atualizar empresa
CREATE TRIGGER trigger_generate_empresa_link
  BEFORE INSERT OR UPDATE ON public.empresas
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_empresa_link_agendamento();

-- Atualizar empresas existentes para ter o link de agendamento
UPDATE public.empresas 
SET link_agendamento = 'https://bbce0725-e9f7-4b45-b833-cb546ff414e3.lovableproject.com/agendamento/' || slug
WHERE slug IS NOT NULL AND link_agendamento IS NULL;

-- Modificar a função existente generate_link_agendamento para usar o link da empresa
CREATE OR REPLACE FUNCTION public.generate_link_agendamento()
RETURNS TRIGGER AS $$
DECLARE
  empresa_link TEXT;
BEGIN
  -- Buscar o link de agendamento da empresa
  SELECT link_agendamento INTO empresa_link
  FROM public.empresas 
  WHERE id = NEW.empresa_id;
  
  -- Usar o link da empresa se disponível, senão usar o formato antigo
  IF empresa_link IS NOT NULL THEN
    NEW.link_agendamento := empresa_link;
  ELSE
    -- Fallback para o formato antigo se não houver link da empresa
    DECLARE
      empresa_nome TEXT;
    BEGIN
      SELECT nome_negocio INTO empresa_nome
      FROM public.empresas 
      WHERE id = NEW.empresa_id;
      
      NEW.link_agendamento := 'https://bbce0725-e9f7-4b45-b833-cb546ff414e3.lovableproject.com/agendamento?empresa=' || 
                             encode(empresa_nome::bytea, 'base64') || 
                             '&id=' || NEW.id::text;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;