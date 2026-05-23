-- ============================================================
-- FocusForge Schema Migration
-- ============================================================

-- ============================================================
-- 0. Utility: updated_at auto-trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$ BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
 $$ LANGUAGE plpgsql;

-- ============================================================
-- 1. profiles
-- ============================================================
CREATE TABLE public.profiles (
  id              UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name    TEXT,
  avatar_url      TEXT,
  level           INT NOT NULL DEFAULT 1,
  total_xp        INT NOT NULL DEFAULT 0,
  current_streak  INT NOT NULL DEFAULT 0,
  best_streak     INT NOT NULL DEFAULT 0,
  plan_type       TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'premium')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: user can view own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: user can insert own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles: user can update own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles: user can delete own"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$ BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  RETURN NEW;
END;
 $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. focus_sessions
-- ============================================================
CREATE TABLE public.focus_sessions (
  id                UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode              TEXT NOT NULL CHECK (mode IN ('pomodoro', 'short_break', 'long_break', 'deep_work', 'custom')),
  duration_minutes  INT NOT NULL,
  completed         BOOLEAN NOT NULL DEFAULT false,
  xp_earned         INT NOT NULL DEFAULT 0,
  started_at        TIMESTAMPTZ NOT NULL,
  ended_at          TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_focus_sessions_user_id ON public.focus_sessions(user_id);
CREATE INDEX idx_focus_sessions_started_at ON public.focus_sessions(user_id, started_at DESC);

ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "focus_sessions: user full access own"
  ON public.focus_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER focus_sessions_set_updated_at
  BEFORE UPDATE ON public.focus_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 3. mood_logs  (The Mirror)
-- ============================================================
CREATE TABLE public.mood_logs (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id  UUID REFERENCES public.focus_sessions(id) ON DELETE SET NULL,
  mood_id     TEXT NOT NULL CHECK (mood_id IN ('anxious', 'bored', 'neutral', 'productive', 'focused')),
  log_type    TEXT NOT NULL CHECK (log_type IN ('pre_session', 'post_session', 'doom_loop_pause')),
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mood_logs_user_id ON public.mood_logs(user_id);
CREATE INDEX idx_mood_logs_timestamp ON public.mood_logs(user_id, timestamp DESC);

ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mood_logs: user full access own"
  ON public.mood_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 4. usage_logs
-- ============================================================
CREATE TABLE public.usage_logs (
  id            UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date      DATE NOT NULL,
  app_id        TEXT NOT NULL,
  category      TEXT NOT NULL,
  minutes_used  INT NOT NULL DEFAULT 0,
  opens_count   INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_usage_logs_user_date_app UNIQUE (user_id, log_date, app_id)
);

CREATE INDEX idx_usage_logs_user_date ON public.usage_logs(user_id, log_date DESC);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usage_logs: user full access own"
  ON public.usage_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER usage_logs_set_updated_at
  BEFORE UPDATE ON public.usage_logs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 5. leisure_bank_state
-- ============================================================
CREATE TABLE public.leisure_bank_state (
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  total_earned_minutes  FLOAT NOT NULL DEFAULT 0,
  total_spent_minutes   FLOAT NOT NULL DEFAULT 0,
  last_reset_date       TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leisure_bank_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leisure_bank_state: user full access own"
  ON public.leisure_bank_state FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER leisure_bank_state_set_updated_at
  BEFORE UPDATE ON public.leisure_bank_state
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 6. ai_insights
-- ============================================================
CREATE TABLE public.ai_insights (
  id            UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_text  TEXT NOT NULL,
  type          TEXT NOT NULL CHECK (type IN ('post_session', 'weekly_report')),
  read          BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_insights_user_id ON public.ai_insights(user_id);
CREATE INDEX idx_ai_insights_unread ON public.ai_insights(user_id, read) WHERE read = false;

ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_insights: user full access own"
  ON public.ai_insights FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 7. Realtime: enable for key tables (optional but useful)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.focus_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leisure_bank_state;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_insights;
