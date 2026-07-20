const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://jchpxowbxxfrivrloqkg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjaHB4b3dieHhmcml2cmxvcWtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTgxNTU3NCwiZXhwIjoyMDk3MzkxNTc0fQ.2IbrGKbj6tDI8i85_4_H0TI7p3eJkj7wergl726N8pY";

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    const { data, error } = await supabase
      .from('checklists_completados')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
      
    if (error) {
      console.error('❌ Error fetching from checklists_completados:', error);
    } else {
      console.log('✅ Fetch successful! Records count:', data.length);
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('💥 Crash:', err);
  }
}

main();
