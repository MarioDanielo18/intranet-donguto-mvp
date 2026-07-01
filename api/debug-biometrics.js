import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase URL/Key is missing on Vercel.' });
  }

  try {
    // 1. Query user jaymadg
    const { data: users, error: userErr } = await supabase
      .from('usuarios')
      .select('*')
      .in('username', ['ccuevadg', 'jaymadg']);

    // 2. Query latest 10 punches from asistencia_biometrica
    const { data: punches, error: punchErr } = await supabase
      .from('asistencia_biometrica')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20);

    return res.status(200).json({
      status: 'success',
      users,
      userError: userErr ? userErr.message : null,
      punches,
      punchError: punchErr ? punchErr.message : null
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
