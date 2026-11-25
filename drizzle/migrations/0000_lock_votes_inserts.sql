DROP POLICY IF EXISTS "Anyone can insert votes" ON public.votes;
REVOKE INSERT ON public.votes FROM anon, authenticated;
GRANT ALL ON public.votes TO service_role;