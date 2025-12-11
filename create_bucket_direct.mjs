// Direct database approach using pg client
import pg from 'pg';
const { Client } = pg;

async function createBucketDirect() {
  // Try different connection approaches
  const connectionConfigs = [
    {
      host: 'db.sxjwoyxwgmmsaqczvjpd.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4and4eXh3Z21tc2FxY3p2anBkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzA0NzcwMCwiZXhwIjoyMDQ4NjIzNzAwfQ.MXSIiCZz5qJsxCBHhGWWz5pjQ1hx6S4ULCk3DUFZFHM',
      ssl: { rejectUnauthorized: false }
    },
    {
      connectionString: 'postgresql://postgres:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4and4eXh3Z21tc2FxY3p2anBkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzA0NzcwMCwiZXhwIjoyMDQ4NjIzNzAwfQ.MXSIiCZz5qJsxCBHhGWWz5pjQ1hx6S4ULCk3DUFZFHM@db.sxjwoyxwgmmsaqczvjpd.supabase.co:5432/postgres?sslmode=require'
    }
  ];

  for (const config of connectionConfigs) {
    const client = new Client(config);
    
    try {
      console.log(`🔗 Attempting connection with ${config.host || 'connection string'}...`);
      await client.connect();
      
      // Test connection
      const result = await client.query('SELECT current_database();');
      console.log('✅ Connected to database:', result.rows[0].current_database);
      
      // Create bucket
      const createBucketQuery = `
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
      `;
      
      console.log('📤 Creating bucket...');
      await client.query(createBucketQuery);
      console.log('✅ Bucket "comic-videos" created/updated successfully!');
      
      // Create policies
      const policies = [
        `CREATE POLICY IF NOT EXISTS "Public read access on comic-videos bucket" 
         ON storage.objects FOR SELECT
         USING (bucket_id = 'comic-videos');`,
        
        `CREATE POLICY IF NOT EXISTS "Admin upload access on comic-videos bucket"
         ON storage.objects FOR INSERT
         WITH CHECK (
           bucket_id = 'comic-videos' 
           AND auth.uid() IS NOT NULL
         );`,
        
        `CREATE POLICY IF NOT EXISTS "Admin delete access on comic-videos bucket"
         ON storage.objects FOR DELETE
         USING (
           bucket_id = 'comic-videos' 
           AND auth.uid() IS NOT NULL
         );`
      ];
      
      console.log('🛡️ Creating RLS policies...');
      for (const policy of policies) {
        try {
          await client.query(policy);
        } catch (policyError) {
          console.log('⚠️ Policy creation (might already exist):', policyError.message);
        }
      }
      
      // Verify bucket creation
      const verifyQuery = `SELECT * FROM storage.buckets WHERE id = 'comic-videos';`;
      const bucketResult = await client.query(verifyQuery);
      
      if (bucketResult.rows.length > 0) {
        console.log('✅ Verification successful - bucket exists:');
        console.log('📋 Bucket details:', {
          name: bucketResult.rows[0].name,
          public: bucketResult.rows[0].public,
          file_size_limit: bucketResult.rows[0].file_size_limit,
          created_at: bucketResult.rows[0].created_at
        });
        
        console.log('\n🎉 BUCKET CREATION COMPLETED FROM CLI!');
        console.log('📱 Test upload at: https://albertomaydayjhondoe.github.io/Porteria/#admin');
        
        await client.end();
        return true;
      } else {
        console.log('❌ Bucket not found after creation');
      }
      
      await client.end();
      return true;
      
    } catch (error) {
      console.log('❌ Connection failed:', error.message);
      try {
        await client.end();
      } catch {}
    }
  }
  
  console.log('\n❌ All connection attempts failed');
  console.log('📝 Manual creation still required in dashboard');
  return false;
}

createBucketDirect();
