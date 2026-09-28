DO $$ BEGIN
  CREATE TYPE public.project_status AS ENUM ('rascunho','andamento','concluido');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS status public.project_status NOT NULL DEFAULT 'andamento',
  ADD COLUMN IF NOT EXISTS order_index integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS projects_order_idx ON public.projects (order_index, created_at DESC);