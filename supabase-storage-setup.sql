-- Crear bucket de Storage para videos
-- Este script debe ejecutarse en el SQL Editor de Supabase

-- Crear bucket público para videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('comic-videos', 'comic-videos', true);

-- Política RLS para permitir lectura pública
CREATE POLICY "Public read access on comic-videos bucket" 
ON storage.objects FOR SELECT
USING (bucket_id = 'comic-videos');

-- Política RLS para permitir upload solo a administradores autenticados
CREATE POLICY "Admin upload access on comic-videos bucket"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'comic-videos' 
  AND auth.uid() IS NOT NULL
);

-- Política RLS para permitir delete solo a administradores autenticados
CREATE POLICY "Admin delete access on comic-videos bucket"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'comic-videos' 
  AND auth.uid() IS NOT NULL
);

-- Política RLS para permitir update solo a administradores autenticados
CREATE POLICY "Admin update access on comic-videos bucket"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'comic-videos' 
  AND auth.uid() IS NOT NULL
);

-- Verificar que el bucket fue creado
SELECT * FROM storage.buckets WHERE name = 'comic-videos';