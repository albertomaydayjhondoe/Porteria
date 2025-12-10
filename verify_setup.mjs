import { createClient } from '@supabase/supabase-js';

console.log('🔍 VERIFICACIÓN COMPLETA DEL SETUP - Porteria Video Admin');
console.log('=' .repeat(60));

const supabaseUrl = 'https://sxjwoyxwgmmsaqczvjpd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4and4eXh3Z21tc2FxY3p2anBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNDc3MDAsImV4cCI6MjA0ODYyMzcwMH0.xQ-UrxLfdOW1r7qpE_hJPGHiT7zFp8jNEh6ajB29jpM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifySetup() {
  console.log('\n1️⃣ CONECTIVIDAD SUPABASE');
  console.log('🔗 URL:', supabaseUrl);
  
  try {
    // Test connection
    const { data, error } = await supabase.from('comic_strips').select('count').limit(1);
    if (error) {
      console.log('⚠️  Database connection:', error.message);
    } else {
      console.log('✅ Database connection: OK');
    }
  } catch (err) {
    console.log('❌ Database connection failed:', err.message);
  }
  
  console.log('\n2️⃣ AUTENTICACIÓN ADMIN');
  
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'sampayo@gmail.com',
      password: 'administrador'  
    });
    
    if (authError) {
      console.log('❌ Admin login failed:', authError.message);
      console.log('📝 Possible solutions:');
      console.log('   - Check if user exists in Supabase Auth');
      console.log('   - Verify email/password in auth.users table');
      console.log('   - Check RLS policies');
    } else {
      console.log('✅ Admin login: OK');
      console.log('👤 User:', authData.user.email);
      console.log('🆔 ID:', authData.user.id);
      
      console.log('\n3️⃣ STORAGE BUCKET VERIFICATION');
      
      // Test storage bucket
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.log('⚠️  Storage access limited (expected):', bucketError.message);
        console.log('📝 This is normal with user authentication');
        
        // Try to upload a test file to see if bucket exists
        console.log('\n🧪 TESTING UPLOAD (bucket existence check)');
        
        const testFile = new Blob(['test video upload'], { type: 'text/plain' });
        const testPath = `test/upload_test_${Date.now()}.txt`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('comic-videos')
          .upload(testPath, testFile);
        
        if (uploadError) {
          if (uploadError.message.includes('Bucket not found')) {
            console.log('❌ BUCKET NOT FOUND: "comic-videos" does not exist');
            console.log('\n📋 MANUAL BUCKET CREATION REQUIRED:');
            console.log('1. Go to: https://supabase.com/dashboard/project/sxjwoyxwgmmsaqczvjpd/storage/buckets');
            console.log('2. Click "Create bucket"');
            console.log('3. Settings:');
            console.log('   - Name: comic-videos');
            console.log('   - Public: ✅ YES');
            console.log('   - File size limit: 150 MB (157286400 bytes)');
            console.log('   - MIME types: video/mp4, video/webm, video/quicktime, video/x-msvideo');
            console.log('4. Create bucket');
            console.log('5. Re-run this verification script');
          } else {
            console.log('⚠️  Upload failed (other reason):', uploadError.message);
          }
        } else {
          console.log('✅ BUCKET EXISTS: Upload test successful!');
          console.log('�� File uploaded to:', uploadData.path);
          
          // Clean up test file
          const { error: deleteError } = await supabase.storage
            .from('comic-videos')
            .remove([testPath]);
          
          if (!deleteError) {
            console.log('🗑️  Test file cleaned up');
          }
          
          console.log('\n4️⃣ PUBLIC URL GENERATION TEST');
          
          const { data: urlData } = supabase.storage
            .from('comic-videos')
            .getPublicUrl('test/sample.mp4');
          
          console.log('✅ Public URL format:', urlData.publicUrl);
          
          console.log('\n5️⃣ DATABASE INSERT TEST');
          
          const testRecord = {
            title: `Test Video ${Date.now()}`,
            publish_date: new Date().toISOString().split('T')[0],
            video_url: urlData.publicUrl,
            image_url: urlData.publicUrl,
            media_type: 'video'
          };
          
          const { data: insertData, error: insertError } = await supabase
            .from('comic_strips')
            .insert([testRecord])
            .select();
          
          if (insertError) {
            console.log('❌ Database insert failed:', insertError.message);
          } else {
            console.log('✅ Database insert: OK');
            console.log('📝 Record ID:', insertData[0].id);
            
            // Clean up test record
            await supabase.from('comic_strips').delete().eq('id', insertData[0].id);
            console.log('🗑️  Test record cleaned up');
          }
        }
      } else {
        console.log('✅ Storage bucket access: OK');
        console.log('📁 Available buckets:', buckets?.map(b => b.name) || []);
        
        const comicVideosBucket = buckets?.find(b => b.name === 'comic-videos');
        if (comicVideosBucket) {
          console.log('✅ Bucket "comic-videos" found!');
          console.log('🔓 Public:', comicVideosBucket.public);
        } else {
          console.log('❌ Bucket "comic-videos" NOT found in available buckets');
        }
      }
    }
  } catch (err) {
    console.log('❌ Authentication error:', err.message);
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎬 PORTERIA VIDEO UPLOAD SYSTEM STATUS:');
  console.log('📱 App: https://albertomaydayjhondoe.github.io/Porteria/');
  console.log('🔐 Admin: https://albertomaydayjhondoe.github.io/Porteria/#admin');
  console.log('⚙️  Dashboard: https://supabase.com/dashboard/project/sxjwoyxwgmmsaqczvjpd');
  console.log('=' .repeat(60));
}

verifySetup().catch(console.error);
