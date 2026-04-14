
-- Create enums
CREATE TYPE public.app_role AS ENUM ('dealer', 'technicien', 'enqueteur', 'admin');
CREATE TYPE public.statut_appareil AS ENUM ('legitime', 'suspect', 'vole');
CREATE TYPE public.statut_signalement AS ENUM ('ouvert', 'en_cours', 'resolu');
CREATE TYPE public.marche_type AS ENUM ('Missebo', 'Dantokpa', 'Cadjehoun', 'Autre');
CREATE TYPE public.activite_type AS ENUM ('revente', 'reparation', 'les_deux');

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nom TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  marche marche_type NOT NULL DEFAULT 'Autre',
  type_activite activite_type NOT NULL DEFAULT 'revente',
  verifications_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile + default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nom, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nom', ''), NEW.email);
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'dealer'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Appareils table
CREATE TABLE public.appareils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imei VARCHAR(15) NOT NULL UNIQUE CHECK (length(imei) = 15),
  marque TEXT NOT NULL DEFAULT '',
  modele TEXT NOT NULL DEFAULT '',
  tac VARCHAR(8) NOT NULL DEFAULT '',
  date_allocation_tac TIMESTAMPTZ,
  statut statut_appareil NOT NULL DEFAULT 'legitime',
  score_anomalie NUMERIC(3,2) NOT NULL DEFAULT 0.00 CHECK (score_anomalie >= 0 AND score_anomalie <= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.appareils ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view appareils" ON public.appareils FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert appareils" ON public.appareils FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins and enqueteurs can update appareils" ON public.appareils FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'enqueteur'));

CREATE TRIGGER update_appareils_updated_at BEFORE UPDATE ON public.appareils
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enregistrements IMEI
CREATE TABLE public.enregistrements_imei (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imei VARCHAR(15) NOT NULL,
  utilisateur_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date_verification TIMESTAMPTZ NOT NULL DEFAULT now(),
  resultat statut_appareil NOT NULL,
  score_anomalie NUMERIC(3,2) NOT NULL DEFAULT 0.00,
  features JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.enregistrements_imei ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own verifications" ON public.enregistrements_imei FOR SELECT USING (auth.uid() = utilisateur_id);
CREATE POLICY "Users can create verifications" ON public.enregistrements_imei FOR INSERT WITH CHECK (auth.uid() = utilisateur_id);

-- Signalements vol
CREATE TABLE public.signalements_vol (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  imei VARCHAR(15) NOT NULL,
  marque TEXT NOT NULL DEFAULT '',
  modele TEXT NOT NULL DEFAULT '',
  date_vol TIMESTAMPTZ NOT NULL,
  quartier TEXT NOT NULL DEFAULT '',
  description TEXT CHECK (length(description) <= 300),
  photo_url TEXT,
  signale_par UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  statut statut_signalement NOT NULL DEFAULT 'ouvert',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.signalements_vol ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view signalements" ON public.signalements_vol FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create signalements" ON public.signalements_vol FOR INSERT TO authenticated WITH CHECK (auth.uid() = signale_par);
CREATE POLICY "Reporter or admins can update signalements" ON public.signalements_vol FOR UPDATE TO authenticated
  USING (auth.uid() = signale_par OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'enqueteur'));

CREATE TRIGGER update_signalements_updated_at BEFORE UPDATE ON public.signalements_vol
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Historique reparations
CREATE TABLE public.historique_reparations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imei VARCHAR(15) NOT NULL,
  technicien_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date_reparation TIMESTAMPTZ NOT NULL DEFAULT now(),
  type_reparation TEXT NOT NULL DEFAULT '',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.historique_reparations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view reparations" ON public.historique_reparations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Techniciens can create reparations" ON public.historique_reparations FOR INSERT TO authenticated WITH CHECK (auth.uid() = technicien_id);

-- Generate signalement reference function
CREATE OR REPLACE FUNCTION public.generate_signalement_reference()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(reference FROM 9) AS INTEGER)), 0) + 1
  INTO next_num FROM public.signalements_vol;
  NEW.reference := 'BJ-' || EXTRACT(YEAR FROM now())::TEXT || '-' || LPAD(next_num::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_signalement_reference
  BEFORE INSERT ON public.signalements_vol
  FOR EACH ROW EXECUTE FUNCTION public.generate_signalement_reference();
