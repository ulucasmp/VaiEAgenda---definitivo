-- Primeiro, vamos limpar os agendamentos duplicados existentes
-- Manter apenas o mais antigo de cada grupo duplicado
DELETE FROM agendamentos 
WHERE id NOT IN (
  SELECT DISTINCT ON (empresa_id, servico_id, data_agendamento, horario) id
  FROM agendamentos 
  WHERE status IN ('agendado', 'confirmado')
  ORDER BY empresa_id, servico_id, data_agendamento, horario, created_at ASC
);

-- Criar constraint única para prevenir agendamentos duplicados
-- Isso garante que não pode haver dois agendamentos no mesmo horário, mesmo serviço, mesma empresa
ALTER TABLE agendamentos 
ADD CONSTRAINT unique_booking_slot 
UNIQUE (empresa_id, servico_id, data_agendamento, horario) 
WHERE status IN ('agendado', 'confirmado');