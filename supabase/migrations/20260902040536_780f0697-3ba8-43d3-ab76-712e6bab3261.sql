-- 1) Status flow for suggestions
DO $$ BEGIN
  CREATE TYPE public.suggestion_status AS ENUM ('recebida','em_analise','encaminhada','em_andamento','concluida','nao_viavel');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.suggestions
  ADD COLUMN IF NOT EXISTS status public.suggestion_status NOT NULL DEFAULT 'recebida',
  ADD COLUMN IF NOT EXISTS admin_response text,
  ADD COLUMN IF NOT EXISTS status_updated_at timestamptz;

-- 2) Prevent duplicate votes at DB level
DELETE FROM public.votes a USING public.votes b
  WHERE a.ctid < b.ctid AND a.item_type = b.item_type AND a.item_id = b.item_id
    AND a.device_id IS NOT NULL AND a.device_id = b.device_id;

CREATE UNIQUE INDEX IF NOT EXISTS votes_unique_device
  ON public.votes (item_type, item_id, device_id) WHERE device_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS votes_unique_profile
  ON public.votes (item_type, item_id, profile_id) WHERE profile_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS comments_item_idx ON public.comments (item_type, item_id, created_at DESC);
CREATE INDEX IF NOT EXISTS suggestions_created_idx ON public.suggestions (created_at DESC);

-- 3) Keep comments_count accurate
CREATE OR REPLACE FUNCTION public.sync_comments_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_type item_type;
  target_id uuid;
  new_count integer;
BEGIN
  target_type := COALESCE(NEW.item_type, OLD.item_type);
  target_id := COALESCE(NEW.item_id, OLD.item_id);

  SELECT count(*) INTO new_count
  FROM public.comments
  WHERE item_type = target_type AND item_id = target_id AND is_approved = true;

  IF target_type = 'suggestion' THEN
    UPDATE public.suggestions SET comments_count = new_count WHERE id = target_id;
  ELSE
    UPDATE public.projects SET comments_count = new_count WHERE id = target_id;
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS sync_comments_count_trg ON public.comments;
CREATE TRIGGER sync_comments_count_trg
AFTER INSERT OR UPDATE OR DELETE ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.sync_comments_count();

-- 4) Grants so the app can read/write through the Data API
GRANT SELECT, INSERT ON public.comments TO anon;
GRANT SELECT, INSERT, UPDATE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
GRANT SELECT ON public.suggestions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggestions TO authenticated;
GRANT ALL ON public.suggestions TO service_role;
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;

-- Moderators may delete comments
DROP POLICY IF EXISTS "Moderators can delete comments" ON public.comments;
CREATE POLICY "Moderators can delete comments" ON public.comments
FOR DELETE TO authenticated USING (public.is_moderator());

-- Recompute existing counts
UPDATE public.suggestions s SET comments_count = (
  SELECT count(*) FROM public.comments c WHERE c.item_type = 'suggestion' AND c.item_id = s.id AND c.is_approved = true
);
UPDATE public.projects p SET comments_count = (
  SELECT count(*) FROM public.comments c WHERE c.item_type = 'project' AND c.item_id = p.id AND c.is_approved = true
);