-- Primeiro, vamos limpar os agendamentos duplicados existentes
-- Manter apenas o mais antigo de cada grupo duplicado
DELETE FROM agendamentos 
WHERE id NOT IN (
  SELECT DISTINCT ON (empresa_id, servico_id, data_agendamento, horario) id
  FROM agendamentos 
  WHERE status IN ('agendado', 'confirmado')
  ORDER BY empresa_id, servico_id, data_agendamento, horario, created_at ASC
);

-- Criar um índice único parcial para prevenir agendamentos duplicados
-- Só se aplica para status 'agendado' e 'confirmado'
CREATE UNIQUE INDEX unique_active_booking_slot 
ON agendamentos (empresa_id, servico_id, data_agendamento, horario) 
WHERE status IN ('agendado', 'confirmado');