-- Create storage bucket for comic videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'comic-videos',
  'comic-videos', 
  true,
  157286400,
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create RLS policies for the bucket
CREATE POLICY IF NOT EXISTS "Public read access on comic-videos bucket" 
ON storage.objects FOR SELECT
USING (bucket_id = 'comic-videos');

CREATE POLICY IF NOT EXISTS "Admin upload access on comic-videos bucket"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'comic-videos' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY IF NOT EXISTS "Admin delete access on comic-videos bucket"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'comic-videos' 
  AND auth.uid() IS NOT NULL
);
