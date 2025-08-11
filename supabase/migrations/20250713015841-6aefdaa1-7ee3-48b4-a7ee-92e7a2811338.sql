-- Adicionar coluna para horários de funcionamento na tabela empresas
ALTER TABLE public.empresas 
ADD COLUMN horarios_funcionamento jsonb DEFAULT '{
  "segunda": {"active": true, "start": "08:00", "end": "18:00"},
  "terca": {"active": true, "start": "08:00", "end": "18:00"},
  "quarta": {"active": true, "start": "08:00", "end": "18:00"},
  "quinta": {"active": true, "start": "08:00", "end": "18:00"},
  "sexta": {"active": true, "start": "08:00", "end": "18:00"},
  "sabado": {"active": true, "start": "08:00", "end": "18:00"},
  "domingo": {"active": false, "start": "08:00", "end": "18:00"}
}'::jsonb;