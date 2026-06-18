import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

  // Fallback mode if Supabase is not configured
  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({ status: 'fallback', message: 'Supabase not configured.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. GET ALL USERS (GET /api/manage-users)
  if (req.method === 'GET') {
    try {
      const { data: users, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        users: users.map(u => ({
          username: u.username,
          password: u.password, // return password for Técnico management panel
          name: u.name,
          role: u.role,
          store: u.store,
          biometricId: u.biometric_id || null
        }))
      });
    } catch (err) {
      console.error('[manage-users GET] Error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // 2. MUTATION OPERATIONS (POST /api/manage-users)
  if (req.method === 'POST') {
    // Read body
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

    const { action, username, password, name, role, store, biometricId } = body;
    if (!action) {
      return res.status(400).json({ error: 'action parameter is required' });
    }

    try {
      // Action: CREATE
      if (action === 'create') {
        if (!username || !password || !name || !role || !store) {
          return res.status(400).json({ error: 'Missing user parameters' });
        }
        const { data, error } = await supabase
          .from('usuarios')
          .insert([{
            username: username.toLowerCase().trim(),
            password: password.trim(),
            name: name.trim(),
            role: role,
            store: store,
            biometric_id: biometricId || null
          }]);

        if (error) throw error;
        return res.status(200).json({ status: 'success', message: 'User created successfully' });
      }

      // Action: UPDATE
      if (action === 'update') {
        if (!username) {
          return res.status(400).json({ error: 'username parameter is required' });
        }

        const updateFields = {};
        if (password !== undefined) updateFields.password = password.trim();
        if (name !== undefined) updateFields.name = name.trim();
        if (role !== undefined) updateFields.role = role;
        if (store !== undefined) updateFields.store = store;
        if (biometricId !== undefined) updateFields.biometric_id = biometricId || null;

        const { error } = await supabase
          .from('usuarios')
          .update(updateFields)
          .eq('username', username.toLowerCase().trim());

        if (error) throw error;
        return res.status(200).json({ status: 'success', message: 'User updated successfully' });
      }

      // Action: DELETE
      if (action === 'delete') {
        if (!username) {
          return res.status(400).json({ error: 'username parameter is required' });
        }

        const { error } = await supabase
          .from('usuarios')
          .delete()
          .eq('username', username.toLowerCase().trim());

        if (error) throw error;
        return res.status(200).json({ status: 'success', message: 'User deleted successfully' });
      }

      return res.status(400).json({ error: 'Invalid action: ' + action });

    } catch (err) {
      console.error(`[manage-users POST action=${action}] Error:`, err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
