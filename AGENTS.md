# AGENTS.md

## Database & access

- Keep `public.is_admin()` and `public.is_moderator()` executable by `anon` and `authenticated`. RLS policies on `suggestions`, `projects`, `comments` and `reports` call them, and Postgres evaluates every applicable policy for the calling role — without EXECUTE, every public list fails with `42501 permission denied`. Keep `has_role()` and trigger functions revoked from public roles. Why: revoking them during hardening silently broke the whole public site.
- After any change to grants, policies or functions, re-check each public list signed-out (plain API call with the publishable key, no session) before reporting the change complete. Why: a policy error only surfaces for visitors, never for the editor.

## Verification

- Test citizen-facing flows end to end in the browser with real input, then delete the rows the test created. Why: the user does not want test content left in the database.
