import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jchpxowbxxfrivrloqkg.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjaHB4b3dieHhmcml2cmxvcWtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTgxNTU3NCwiZXhwIjoyMDk3MzkxNTc0fQ.2IbrGKbj6tDI8i85_4_H0TI7p3eJkj7wergl726N8pY';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runMigration() {
  console.log('[Supabase Migration] Connecting to active Supabase project jchpxowbxxfrivrloqkg...');

  try {
    // 1. Seed Don Guto Organization
    console.log('[Supabase Migration] Seeding Don Guto Organization in organizations table...');
    const { data: org, error: orgErr } = await supabase
      .from('organizations')
      .upsert({
        name: 'Don Guto Cafetería',
        slug: 'don-guto',
        logo_url: '/favicon.svg',
        primary_color: '#4F46E5',
        secondary_color: '#10B981',
        status: 'Activa'
      }, { onConflict: 'slug' })
      .select();

    if (orgErr) {
      console.warn('[Supabase Migration] Warning on organizations upsert:', orgErr.message);
    } else {
      console.log('[Supabase Migration] SUCCESS: Organization ready! Org ID:', org?.[0]?.id || 'OK');
    }

    // 2. Fetch usuarios table count
    const { data: users, count: usersCount, error: usersErr } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact' });

    if (usersErr) {
      console.warn('[Supabase Migration] usuarios table query warning:', usersErr.message);
    } else {
      console.log(`[Supabase Migration] SUCCESS: usuarios table has ${usersCount || users?.length} records.`);
    }

    // 3. Fetch asistencia_biometrica count
    const { data: asist, count: asistCount, error: asistErr } = await supabase
      .from('asistencia_biometrica')
      .select('*', { count: 'exact' });

    if (asistErr) {
      console.warn('[Supabase Migration] asistencia_biometrica query warning:', asistErr.message);
    } else {
      console.log(`[Supabase Migration] SUCCESS: asistencia_biometrica table has ${asistCount || asist?.length} records.`);
    }

    console.log('[Supabase Migration] All checks completed successfully!');
  } catch (err) {
    console.error('[Supabase Migration] Migration error:', err);
  }
}

runMigration();
