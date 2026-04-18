-- Recreate handle_new_user with strict role validation and admin protection
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  requested_role text;
  final_role public.app_role;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, nom, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nom', ''), NEW.email);

  -- Extract requested role from metadata
  requested_role := NEW.raw_user_meta_data->>'role';

  -- Whitelist: only allow self-signup for dealer, technicien, enqueteur
  -- admin is NEVER allowed via self-signup (must be granted manually)
  IF requested_role IN ('dealer', 'technicien', 'enqueteur') THEN
    final_role := requested_role::public.app_role;
  ELSIF requested_role = 'admin' THEN
    RAISE WARNING 'Self-signup as admin denied for user %, defaulting to dealer', NEW.email;
    final_role := 'dealer'::public.app_role;
  ELSE
    RAISE WARNING 'Unknown or missing role "%" for user %, defaulting to dealer', requested_role, NEW.email;
    final_role := 'dealer'::public.app_role;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, final_role);

  RETURN NEW;
END;
$function$;

-- Ensure the trigger exists on auth.users (recreate to be safe)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();