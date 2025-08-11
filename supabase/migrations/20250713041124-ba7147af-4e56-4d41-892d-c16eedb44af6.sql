-- Atualizar o valor padrão do campo status para 'agendado - pendente de confirmação'
ALTER TABLE agendamentos 
ALTER COLUMN status SET DEFAULT 'agendado - pendente de confirmação';

-- Remover o índice anterior que considerava apenas status confirmado
DROP INDEX IF EXISTS unique_confirmed_booking_slot;

-- Criar novo índice único para prevenir agendamentos duplicados por profissional
-- Bloqueia duplicatas para o mesmo profissional, data e horário independente do status
CREATE UNIQUE INDEX unique_professional_booking_slot 
ON agendamentos (profissional_id, data_agendamento, horario) 
WHERE profissional_id IS NOT NULL;

-- Criar índice único para serviços sem profissional específico (caso exista essa funcionalidade)
CREATE UNIQUE INDEX unique_service_booking_slot 
ON agendamentos (empresa_id, servico_id, data_agendamento, horario) 
WHERE profissional_id IS NULL;