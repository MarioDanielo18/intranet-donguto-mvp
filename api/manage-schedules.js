import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase configuration is missing on Vercel.' });
  }

  // 1. GET: Fetch schedules for a date range
  if (req.method === 'GET') {
    const { startDate, endDate, store } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Missing parameters: startDate and endDate are required.' });
    }

    try {
      let query = supabase
        .from('horarios_semanales')
        .select('*')
        .gte('fecha', startDate)
        .lte('fecha', endDate);

      if (store && store !== 'Todas') {
        query = query.eq('store', store);
      }

      const { data, error } = await query;
      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        schedules: data || []
      });

    } catch (err) {
      console.error('[api/manage-schedules GET] Error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // 2. POST: Insert, Update or Delete
  if (req.method === 'POST') {
    let body = '';
    try {
      body = await new Promise((resolve, reject) => {
        let chunkData = '';
        req.on('data', chunk => {
          chunkData += chunk;
        });
        req.on('end', () => {
          resolve(JSON.parse(chunkData));
        });
        req.on('error', reject);
      });
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON request body.' });
    }

    const { action } = body;
    if (!action) {
      return res.status(400).json({ error: 'action parameter is required.' });
    }

    try {
      // Action: UPSERT
      if (action === 'upsert') {
        const { schedules } = body;
        if (!Array.isArray(schedules) || schedules.length === 0) {
          return res.status(400).json({ error: 'Missing or empty schedules array.' });
        }

        const cleanSchedules = schedules.map(s => ({
          username: String(s.username).toLowerCase().trim(),
          fecha: s.fecha,
          hora_entrada: String(s.hora_entrada || 'OFF').trim(),
          hora_salida: String(s.hora_salida || 'OFF').trim(),
          store: String(s.store || '28 de Julio Miraflores').trim()
        }));

        const { data, error } = await supabase
          .from('horarios_semanales')
          .upsert(cleanSchedules, { onConflict: 'username,fecha' });

        if (error) throw error;

        return res.status(200).json({
          status: 'success',
          message: `Successfully saved ${cleanSchedules.length} schedule entries.`
        });
      }

      // Action: DELETE
      if (action === 'delete') {
        const { username, fecha } = body;
        if (!username || !fecha) {
          return res.status(400).json({ error: 'username and fecha parameters are required.' });
        }

        const { error } = await supabase
          .from('horarios_semanales')
          .delete()
          .eq('username', String(username).toLowerCase().trim())
          .eq('fecha', fecha);

        if (error) throw error;

        return res.status(200).json({
          status: 'success',
          message: 'Schedule entry deleted successfully.'
        });
      }

      return res.status(400).json({ error: 'Invalid action parameter: ' + action });

    } catch (err) {
      console.error(`[api/manage-schedules POST action=${action}] Error:`, err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
