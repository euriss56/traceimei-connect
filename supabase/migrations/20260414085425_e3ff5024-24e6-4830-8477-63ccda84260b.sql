
DROP POLICY "Authenticated users can insert appareils" ON public.appareils;
CREATE POLICY "Authorized users can insert appareils" ON public.appareils FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') 
    OR public.has_role(auth.uid(), 'enqueteur') 
    OR public.has_role(auth.uid(), 'dealer')
    OR public.has_role(auth.uid(), 'technicien')
  );
