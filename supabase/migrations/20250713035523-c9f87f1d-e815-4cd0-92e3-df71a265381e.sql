-- Atualizar o valor padrão do campo status para 'pendente'
ALTER TABLE agendamentos 
ALTER COLUMN status SET DEFAULT 'pendente';

-- Atualizar o índice único para considerar apenas agendamentos confirmados
DROP INDEX IF EXISTS unique_active_booking_slot;

CREATE UNIQUE INDEX unique_confirmed_booking_slot 
ON agendamentos (empresa_id, servico_id, data_agendamento, horario) 
WHERE status = 'confirmado';