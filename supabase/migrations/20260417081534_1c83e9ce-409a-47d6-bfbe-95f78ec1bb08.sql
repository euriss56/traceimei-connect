-- Bucket pour les photos de signalements de vol
INSERT INTO storage.buckets (id, name, public)
VALUES ('signalements-photos', 'signalements-photos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies pour le bucket
CREATE POLICY "Photos signalements publiquement visibles"
ON storage.objects FOR SELECT
USING (bucket_id = 'signalements-photos');

CREATE POLICY "Utilisateurs authentifiés peuvent uploader leur photo de signalement"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'signalements-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Utilisateurs peuvent supprimer leurs propres photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'signalements-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);