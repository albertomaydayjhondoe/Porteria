import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxjwoyxwgmmsaqczvjpd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4and4eXh3Z21tc2FxY3p2anBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNDc3MDAsImV4cCI6MjA0ODYyMzcwMH0.xQ-UrxLfdOW1r7qpE_hJPGHiT7zFp8jNEh6ajB29jpM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createBucketWithAuth() {
  try {
    console.log('🔐 Authenticating as admin...');
    
    // Login as admin
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'sampayo@gmail.com',
      password: 'administrador'
    });
    
    if (authError) {
      console.error('❌ Authentication failed:', authError.message);
      return;
    }
    
    console.log('✅ Authenticated as:', authData.user.email);
    
    // Check existing buckets
    console.log('📁 Checking existing buckets...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.log('⚠️ Cannot list buckets (expected with anon key):', listError.message);
    } else {
      console.log('📋 Existing buckets:', buckets?.map(b => b.name) || []);
      
      const existingBucket = buckets?.find(b => b.name === 'comic-videos');
      if (existingBucket) {
        console.log('✅ Bucket "comic-videos" already exists!');
        return;
      }
    }
    
    // Try to create bucket
    console.log('📤 Attempting to create "comic-videos" bucket...');
    const { data, error } = await supabase.storage.createBucket('comic-videos', {
      public: true,
      fileSizeLimit: 157286400, // 150MB
      allowedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
    });
    
    if (error) {
      console.error('❌ Error creating bucket:', error.message);
      console.log('\n📝 Manual creation required:');
      console.log('1. Go to: https://supabase.com/dashboard/project/sxjwoyxwgmmsaqczvjpd/storage/buckets');
      console.log('2. Click "Create bucket"');
      console.log('3. Name: comic-videos');  
      console.log('4. Public: ✅ Yes');
      console.log('5. File size limit: 157286400 (150MB)');
    } else {
      console.log('✅ Bucket created successfully!', data);
    }
    
    // Test upload permissions
    console.log('\n🧪 Testing upload permissions...');
    const testFile = new Blob(['test'], { type: 'text/plain' });
    const testPath = `test/test_${Date.now()}.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('comic-videos')
      .upload(testPath, testFile);
    
    if (uploadError) {
      console.log('⚠️ Upload test failed (bucket might not exist):', uploadError.message);
    } else {
      console.log('✅ Upload test successful! Cleaning up...');
      
      // Clean up test file
      await supabase.storage.from('comic-videos').remove([testPath]);
      console.log('🗑️ Test file cleaned up');
    }
    
  } catch (err) {
    console.error('❌ Exception:', err.message);
  }
}

createBucketWithAuth();
