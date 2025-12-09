-- Create admin user in Supabase
-- After running this migration, you need to:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Create a user with email: admin@porteria.com
-- 3. Copy the user ID
-- 4. Run the INSERT statement below with that ID

-- Insert admin role for the user
-- Replace 'USER_ID_HERE' with the actual UUID from Supabase Dashboard
-- Example:
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'admin');

-- Alternatively, you can use this function to assign admin role:
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Insert admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Usage example (run after creating user in Supabase Dashboard):
-- SELECT public.make_user_admin('admin@porteria.com');
