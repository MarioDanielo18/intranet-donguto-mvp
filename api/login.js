import { getSupabaseServer } from './lib/supabaseServer.js';
import { setCorsHeaders, parseJsonBody, sendSuccess, sendError } from './lib/saasHelper.js';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return sendError(res, 'Method not allowed', 405);
  }

  let body;
  try {
    body = await parseJsonBody(req);
  } catch (e) {
    return sendError(res, 'Invalid JSON request body', 400);
  }

  const { username, password, organizationSlug } = body;
  if (!username || !password) {
    return sendError(res, 'Username and password are required', 400);
  }

  const supabase = getSupabaseServer();

  // Fallback mode if Supabase is not configured
  if (!supabase) {
    return sendSuccess(res, { status: 'fallback', message: 'Supabase not configured. Using local fallback.' });
  }

  try {
    // Query user by username
    let query = supabase
      .from('usuarios')
      .select('*')
      .eq('username', username.toLowerCase().trim());

    const { data: users, error } = await query;

    if (error || !users || users.length === 0) {
      return sendError(res, 'Usuario o contraseña incorrectos', 401);
    }

    const user = users[0];

    // Password comparison
    const dbPassword = user.password_hash || user.password;
    if (dbPassword !== password) {
      return sendError(res, 'Usuario o contraseña incorrectos', 401);
    }

    // Return authenticated user profile (excluding password)
    return sendSuccess(res, {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        apellidos: user.apellidos || '',
        dni: user.dni || '',
        email: user.email || '',
        telefono: user.telefono || '',
        role: user.role,
        store: user.store_name || user.store || 'Todas',
        biometricId: user.biometric_id || null,
        organizationId: user.organization_id || null
      }
    });

  } catch (err) {
    console.error('[login-api] Error:', err);
    return sendError(res, 'Internal server error: ' + err.message, 500);
  }
}
