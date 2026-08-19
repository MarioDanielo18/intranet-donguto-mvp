import { getSupabaseServer } from './lib/supabaseServer.js';
import { setCorsHeaders, parseJsonBody, sendSuccess, sendError } from './lib/saasHelper.js';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabase = getSupabaseServer();

  // 1. GET: Fetch attendance logs for a store and date range
  if (req.method === 'GET') {
    const { date, store, username } = req.query;

    if (!supabase) {
      return sendSuccess(res, { status: 'fallback', logs: [] });
    }

    try {
      let query = supabase.from('asistencia_biometrica').select('*').order('timestamp', { ascending: false });

      if (date && date !== 'all') {
        query = query.eq('date', date);
      }
      if (store && store !== 'Todas') {
        query = query.eq('store', store);
      }
      if (username) {
        query = query.eq('username', username);
      }

      const { data, error } = await query;

      if (error) throw error;

      return sendSuccess(res, {
        logs: (data || []).map(row => ({
          punchId: row.punch_id || row.id,
          username: row.username,
          name: row.name,
          store: row.store,
          date: row.date,
          time: row.time,
          timestamp: row.timestamp,
          photoUrl: row.photo_url || row.photoUrl || null,
          delayMinutes: row.delay_minutes || 0,
          status: row.status || 'A tiempo',
          method: row.method || 'web_camera'
        }))
      });
    } catch (err) {
      console.error('[attendance GET] Error:', err);
      return sendError(res, err.message, 500);
    }
  }

  // 2. POST: Save a new photo check-in with live timestamp
  if (req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { username, name, store, photoUrl, expectedTimeStr, organizationId } = body;

      if (!username) {
        return sendError(res, 'Username is required', 400);
      }

      const now = new Date();
      // Lima, Peru time string
      const dateStr = now.toISOString().split('T')[0];
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;

      // Calculate delay if expected time is provided
      let delayMinutes = 0;
      let statusStr = 'A tiempo';

      if (expectedTimeStr) {
        const [expH, expM] = expectedTimeStr.split(':').map(Number);
        const curMins = now.getHours() * 60 + now.getMinutes();
        const expMins = expH * 60 + expM;
        if (curMins > expMins) {
          delayMinutes = curMins - expMins;
          statusStr = `Tardanza (${delayMinutes} min)`;
        }
      }

      const punchId = `PHOTO-${username}-${dateStr}-${hours}${minutes}`;

      if (supabase) {
        const payload = {
          punch_id: punchId,
          username: username,
          name: name || username,
          store: store || 'Basadre - San Isidro',
          date: dateStr,
          time: timeStr,
          timestamp: now.toISOString(),
          photo_url: photoUrl,
          delay_minutes: delayMinutes,
          status: statusStr,
          method: 'web_camera'
        };

        if (organizationId) {
          payload.organization_id = organizationId;
        }

        const { error } = await supabase.from('asistencia_biometrica').upsert([payload]);
        if (error) {
          console.warn('[attendance POST] Supabase save warning:', error.message);
        }
      }

      return sendSuccess(res, {
        message: 'Asistencia con foto registrada correctamente.',
        log: {
          punchId,
          username,
          name: name || username,
          store: store || 'Basadre - San Isidro',
          date: dateStr,
          time: timeStr,
          timestamp: now.toISOString(),
          photoUrl,
          delayMinutes,
          status: statusStr,
          method: 'web_camera'
        }
      });
    } catch (err) {
      console.error('[attendance POST] Error:', err);
      return sendError(res, err.message, 500);
    }
  }
}
