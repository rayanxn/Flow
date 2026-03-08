-- Backfill profile rows for any auth users created before the profile trigger existed
INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'avatar_url'
FROM auth.users
WHERE email IS NOT NULL
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
