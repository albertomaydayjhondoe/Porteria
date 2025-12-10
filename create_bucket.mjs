import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxjwoyxwgmmsaqczvjpd.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4and4eXh3Z21tc2FxY3p2anBkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzA0NzcwMCwiZXhwIjoyMDQ4NjIzNzAwfQ.MXSIiCZz5qJsxCBHhGWWz5pjQ1hx6S4ULCk3DUFZFHM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createStorageBucket() {
  try {
    console.log('🔗 Connecting to Supabase...');
    
    // First, check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return;
    }
    
    console.log('📁 Existing buckets:', buckets?.map(b => b.name) || []);
    
    // Check if comic-videos bucket already exists
    const existingBucket = buckets?.find(b => b.name === 'comic-videos');
    if (existingBucket) {
      console.log('✅ Bucket "comic-videos" already exists');
      console.log('📋 Bucket info:', existingBucket);
      return;
    }
    
    console.log('📤 Creating bucket "comic-videos"...');
    
    // Create the bucket
    const { data, error } = await supabase.storage.createBucket('comic-videos', {
      public: true,
      fileSizeLimit: 104857600, // 100MB
      allowedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
    });
    
    if (error) {
      console.error('❌ Error creating bucket:', error);
    } else {
      console.log('✅ Bucket created successfully!');
      console.log('📋 Bucket data:', data);
    }
  } catch (err) {
    console.error('❌ Exception:', err.message);
  }
}

createStorageBucket();
