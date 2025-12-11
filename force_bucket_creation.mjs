import { createClient } from '@supabase/supabase-js';
import https from 'https';

console.log('🚀 FORCE BUCKET CREATION - All Methods Attempt');
console.log('=' .repeat(60));

const supabaseUrl = 'https://sxjwoyxwgmmsaqczvjpd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4and4eXh3Z21tc2FxY3p2anBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNDc3MDAsImV4cCI6MjA0ODYyMzcwMH0.xQ-UrxLfdOW1r7qpE_hJPGHiT7zFp8jNEh6ajB29jpM';

// Method 1: Try with authenticated user
async function method1_AuthenticatedUser() {
  console.log('\n1️⃣ METHOD 1: Authenticated User Bucket Creation');
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    // Login first
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'sampayo@gmail.com',
      password: 'administrador'
    });
    
    if (authError) {
      console.log('❌ Auth failed:', authError.message);
      return false;
    }
    
    console.log('✅ Authenticated as:', authData.user.email);
    
    // Try to create bucket
    const { data, error } = await supabase.storage.createBucket('comic-videos', {
      public: true,
      fileSizeLimit: 157286400,
      allowedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
    });
    
    if (error) {
      console.log('❌ Bucket creation failed:', error.message);
      
      // Try to check if bucket already exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      if (!listError) {
        const existing = buckets?.find(b => b.name === 'comic-videos');
        if (existing) {
          console.log('✅ Bucket already exists!');
          return true;
        }
      }
      return false;
    } else {
      console.log('✅ Bucket created successfully!');
      return true;
    }
  } catch (err) {
    console.log('❌ Method 1 failed:', err.message);
    return false;
  }
}

// Method 2: Direct HTTP API calls
async function method2_DirectAPI() {
  console.log('\n2️⃣ METHOD 2: Direct Storage API');
  
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      id: 'comic-videos',
      name: 'comic-videos',
      public: true,
      fileSizeLimit: 157286400,
      allowedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
    });
    
    const options = {
      hostname: 'sxjwoyxwgmmsaqczvjpd.supabase.co',
      port: 443,
      path: '/storage/v1/bucket',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('📡 API Response:', res.statusCode);
        console.log('📝 Response body:', data);
        resolve(res.statusCode === 200 || res.statusCode === 201);
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ HTTP request failed:', error.message);
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

// Method 3: Test upload to see if bucket exists
async function method3_TestUpload() {
  console.log('\n3️⃣ METHOD 3: Test Upload (Bucket Detection)');
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    // Login first
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'sampayo@gmail.com',
      password: 'administrador'
    });
    
    if (authError) {
      console.log('❌ Auth required for upload test');
      return false;
    }
    
    // Try upload to test bucket existence
    const testFile = new Blob(['test'], { type: 'text/plain' });
    const testPath = `test/bucket_test_${Date.now()}.txt`;
    
    const { data, error } = await supabase.storage
      .from('comic-videos')
      .upload(testPath, testFile);
    
    if (error) {
      if (error.message.includes('Bucket not found')) {
        console.log('❌ Bucket does not exist:', error.message);
        return false;
      } else {
        console.log('⚠️ Upload failed (other reason):', error.message);
        return false;
      }
    } else {
      console.log('✅ Bucket exists! Upload successful:', data.path);
      
      // Clean up test file
      await supabase.storage.from('comic-videos').remove([testPath]);
      console.log('🗑️ Test file cleaned up');
      return true;
    }
  } catch (err) {
    console.log('❌ Method 3 failed:', err.message);
    return false;
  }
}

// Run all methods
async function runAllMethods() {
  const results = [];
  
  results.push(await method1_AuthenticatedUser());
  results.push(await method2_DirectAPI());
  results.push(await method3_TestUpload());
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RESULTS SUMMARY:');
  console.log('Method 1 (Auth + Create):', results[0] ? '✅ SUCCESS' : '❌ FAILED');
  console.log('Method 2 (Direct API):', results[1] ? '✅ SUCCESS' : '❌ FAILED');
  console.log('Method 3 (Upload Test):', results[2] ? '✅ SUCCESS' : '❌ FAILED');
  
  const success = results.some(r => r);
  
  if (success) {
    console.log('\n🎉 BUCKET CREATION/VERIFICATION SUCCESSFUL!');
    console.log('📱 Test the admin panel: https://albertomaydayjhondoe.github.io/Porteria/#admin');
  } else {
    console.log('\n❌ ALL METHODS FAILED');
    console.log('📝 MANUAL CREATION REQUIRED:');
    console.log('1. Go to: https://supabase.com/dashboard/project/sxjwoyxwgmmsaqczvjpd/storage/buckets');
    console.log('2. Create bucket: comic-videos (public, 157286400 bytes limit)');
  }
  
  console.log('=' .repeat(60));
}

runAllMethods();
