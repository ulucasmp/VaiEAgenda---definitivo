
-- Criar uma função que gera o slug a partir do nome do negócio
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        unaccent(input_text), 
        '[^a-zA-Z0-9\s]', '', 'g'
      ), 
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Criar função para gerar slug apenas na inserção
CREATE OR REPLACE FUNCTION set_empresa_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Só gera o slug se ele for NULL (criação inicial)
  IF NEW.slug IS NULL THEN
    NEW.slug := generate_slug(NEW.nome_negocio);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger que executa ANTES da inserção
DROP TRIGGER IF EXISTS trigger_set_empresa_slug ON empresas;
CREATE TRIGGER trigger_set_empresa_slug
  BEFORE INSERT ON empresas
  FOR EACH ROW
  EXECUTE FUNCTION set_empresa_slug();

-- Habilitar a extensão unaccent se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS unaccent;
