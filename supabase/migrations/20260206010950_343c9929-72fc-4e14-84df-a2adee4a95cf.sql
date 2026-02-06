-- Enum para tipo de item (projeto ou sugestão)
CREATE TYPE public.item_type AS ENUM ('project', 'suggestion');

-- Enum para tipo de voto
CREATE TYPE public.vote_type AS ENUM ('up', 'down');

-- Enum para categorias
CREATE TYPE public.category_type AS ENUM (
  'infraestrutura', 
  'saude', 
  'educacao', 
  'seguranca', 
  'social', 
  'meio_ambiente', 
  'cultura', 
  'transporte'
);

-- Tabela de perfis de usuários (opcional - para login identificado)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT,
  email TEXT,
  is_moderator BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Tabela de dispositivos (para controle anti-fraude de anônimos)
CREATE TABLE public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_fingerprint TEXT UNIQUE NOT NULL,
  last_suggestion_at TIMESTAMPTZ,
  last_vote_at TIMESTAMPTZ,
  suggestion_count INTEGER DEFAULT 0,
  vote_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Tabela de projetos da vereadora
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category public.category_type NOT NULL,
  area TEXT,
  is_published BOOLEAN DEFAULT true,
  votes_up INTEGER DEFAULT 0,
  votes_down INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Tabela de sugestões da comunidade
CREATE TABLE public.suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category public.category_type NOT NULL,
  neighborhood TEXT,
  author_name TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  is_approved BOOLEAN DEFAULT true,
  votes_up INTEGER DEFAULT 0,
  votes_down INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Tabela de votos
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type public.item_type NOT NULL,
  item_id UUID NOT NULL,
  vote public.vote_type NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT unique_vote_per_user_item UNIQUE (item_type, item_id, profile_id),
  CONSTRAINT unique_vote_per_device_item UNIQUE (item_type, item_id, device_id)
);

-- Tabela de comentários
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type public.item_type NOT NULL,
  item_id UUID NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Tabela de logs para moderação
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  item_type public.item_type,
  item_id UUID,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  ip_address INET,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Índices para performance
CREATE INDEX idx_suggestions_category ON public.suggestions(category);
CREATE INDEX idx_suggestions_created_at ON public.suggestions(created_at DESC);
CREATE INDEX idx_suggestions_votes ON public.suggestions(votes_up DESC, votes_down);
CREATE INDEX idx_projects_category ON public.projects(category);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX idx_votes_item ON public.votes(item_type, item_id);
CREATE INDEX idx_comments_item ON public.comments(item_type, item_id);
CREATE INDEX idx_devices_fingerprint ON public.devices(device_fingerprint);
CREATE INDEX idx_activity_logs_created ON public.activity_logs(created_at DESC);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Função helper para verificar se é moderador
CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND is_moderator = true
  )
$$;

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_suggestions_updated_at
  BEFORE UPDATE ON public.suggestions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies para profiles
CREATE POLICY "Profiles are viewable by owner or moderator"
  ON public.profiles FOR SELECT
  USING (user_id = auth.uid() OR public.is_moderator());

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (user_id = auth.uid());

-- RLS Policies para devices (acesso via service role apenas)
CREATE POLICY "Devices are manageable by service role"
  ON public.devices FOR ALL
  USING (true);

-- RLS Policies para projects (públicos para leitura)
CREATE POLICY "Published projects are viewable by everyone"
  ON public.projects FOR SELECT
  USING (is_published = true);

CREATE POLICY "Moderators can manage projects"
  ON public.projects FOR ALL
  USING (public.is_moderator());

-- RLS Policies para suggestions (públicas para leitura)
CREATE POLICY "Approved suggestions are viewable by everyone"
  ON public.suggestions FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Anyone can insert suggestions"
  ON public.suggestions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owners can update their suggestions"
  ON public.suggestions FOR UPDATE
  USING (profile_id IS NOT NULL AND profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Moderators can manage all suggestions"
  ON public.suggestions FOR ALL
  USING (public.is_moderator());

-- RLS Policies para votes
CREATE POLICY "Anyone can insert votes"
  ON public.votes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own votes"
  ON public.votes FOR SELECT
  USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_moderator()
  );

-- RLS Policies para comments
CREATE POLICY "Approved comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Anyone can insert comments"
  ON public.comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owners can update their comments"
  ON public.comments FOR UPDATE
  USING (profile_id IS NOT NULL AND profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Moderators can manage all comments"
  ON public.comments FOR ALL
  USING (public.is_moderator());

-- RLS Policies para activity_logs (apenas moderadores)
CREATE POLICY "Only moderators can view activity logs"
  ON public.activity_logs FOR SELECT
  USING (public.is_moderator());

CREATE POLICY "Service role can insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (true);

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();