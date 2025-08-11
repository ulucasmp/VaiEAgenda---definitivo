-- Atualizar o valor padrão do campo status para 'agendado - pendente de confirmação'
ALTER TABLE agendamentos 
ALTER COLUMN status SET DEFAULT 'agendado - pendente de confirmação';

-- Remover o índice anterior que considerava apenas status confirmado
DROP INDEX IF EXISTS unique_confirmed_booking_slot;

-- Limpar agendamentos duplicados mantendo apenas o mais antigo de cada grupo
-- Para agendamentos com profissional
DELETE FROM agendamentos 
WHERE id NOT IN (
  SELECT DISTINCT ON (profissional_id, data_agendamento, horario) id
  FROM agendamentos 
  WHERE profissional_id IS NOT NULL
  ORDER BY profissional_id, data_agendamento, horario, created_at ASC
);

-- Para agendamentos sem profissional específico
DELETE FROM agendamentos 
WHERE id NOT IN (
  SELECT DISTINCT ON (empresa_id, servico_id, data_agendamento, horario) id
  FROM agendamentos 
  WHERE profissional_id IS NULL
  ORDER BY empresa_id, servico_id, data_agendamento, horario, created_at ASC
);

-- Criar novo índice único para prevenir agendamentos duplicados por profissional
CREATE UNIQUE INDEX unique_professional_booking_slot 
ON agendamentos (profissional_id, data_agendamento, horario) 
WHERE profissional_id IS NOT NULL;

-- Criar índice único para serviços sem profissional específico
CREATE UNIQUE INDEX unique_service_booking_slot 
ON agendamentos (empresa_id, servico_id, data_agendamento, horario) 
WHERE profissional_id IS NULL;