-- Atualizar estrutura padrão de horários funcionamento para suportar dois turnos
ALTER TABLE public.empresas 
ALTER COLUMN horarios_funcionamento SET DEFAULT '{
  "segunda": {"active": true, "shifts": [{"start": "08:00", "end": "12:00"}, {"start": "14:00", "end": "18:00"}]},
  "terca": {"active": true, "shifts": [{"start": "08:00", "end": "12:00"}, {"start": "14:00", "end": "18:00"}]},
  "quarta": {"active": true, "shifts": [{"start": "08:00", "end": "12:00"}, {"start": "14:00", "end": "18:00"}]},
  "quinta": {"active": true, "shifts": [{"start": "08:00", "end": "12:00"}, {"start": "14:00", "end": "18:00"}]},
  "sexta": {"active": true, "shifts": [{"start": "08:00", "end": "12:00"}, {"start": "14:00", "end": "18:00"}]},
  "sabado": {"active": false, "shifts": []},
  "domingo": {"active": false, "shifts": []}
}'::jsonb;