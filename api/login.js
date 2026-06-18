import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Read body from request
  let body = '';
  try {
    body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        resolve(JSON.parse(data));
      });
      req.on('error', reject);
    });
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON request body' });
  }

  const { username, password } = body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

  // If Supabase is not configured, inform client to use local fallback
  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({ status: 'fallback', message: 'Supabase not configured. Using local fallback.' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Query user by username
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('username', username.toLowerCase().trim())
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Verify password (plain-text comparison for simplicity in this MVP config)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Return authenticated user profile (excluding password)
    return res.status(200).json({
      status: 'success',
      user: {
        username: user.username,
        name: user.name,
        role: user.role,
        store: user.store,
        biometricId: user.biometric_id || null
      }
    });

  } catch (err) {
    console.error('[login-api] Error:', err);
    return res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
}
