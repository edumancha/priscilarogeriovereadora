
-- 1. Remove overly permissive policies (service_role bypasses RLS anyway)
DROP POLICY IF EXISTS "Devices are manageable by service role" ON public.devices;
DROP POLICY IF EXISTS "Service role can insert activity logs" ON public.activity_logs;

-- 2. Prevent profile self-escalation to moderator via trigger
CREATE OR REPLACE FUNCTION public.prevent_profile_moderator_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_moderator IS DISTINCT FROM OLD.is_moderator
     AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.is_moderator := OLD.is_moderator;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_profile_moderator_escalation ON public.profiles;
CREATE TRIGGER prevent_profile_moderator_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_moderator_escalation();

-- 3. Switch is_moderator() to use user_roles (canonical source of truth)
CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'moderator')
      OR public.has_role(auth.uid(), 'admin')
$$;

-- 4. Fix search_path on update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 5. Revoke EXECUTE on SECURITY DEFINER helpers from anon/authenticated.
--    They continue to work inside RLS policies (definer context) but cannot
--    be called directly via the Data API.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_moderator() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.prevent_profile_moderator_escalation() FROM anon, authenticated, public;
