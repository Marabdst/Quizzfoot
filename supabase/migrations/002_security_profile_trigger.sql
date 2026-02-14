-- QuizzFoot — Migration 002: Security & Auto Profile
-- Run this in Supabase SQL Editor

-- ═══ AUTO-CREATE PROFILE ON SIGNUP ═══
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      split_part(NEW.email, '@', 1)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══ DUEL RLS POLICIES (missing from 001) ═══
-- Everyone can view duels (to join via shared link)
CREATE POLICY "Duels are viewable by everyone" ON duels FOR SELECT USING (true);
-- Authenticated users can create duels
CREATE POLICY "Authenticated users can create duels" ON duels FOR INSERT
  WITH CHECK (auth.uid() = challenger_id);
-- Challenger or opponent can update duel
CREATE POLICY "Duel participants can update" ON duels FOR UPDATE
  USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

-- ═══ DAILY CHALLENGES RLS ═══
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Daily challenges are viewable by everyone" ON daily_challenges FOR SELECT USING (true);

-- ═══ ADMIN: full CRUD on questions & categories ═══
-- Add INSERT + UPDATE + DELETE for admins (the ALL policy from 001 covers it,
-- but let's make sure the service role can also manage data)
-- Grant service_role full access (used by server actions)
GRANT ALL ON categories TO service_role;
GRANT ALL ON questions TO service_role;
GRANT ALL ON profiles TO service_role;
GRANT ALL ON attempts TO service_role;
GRANT ALL ON duels TO service_role;
GRANT ALL ON daily_challenges TO service_role;
