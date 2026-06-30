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
    return res.status(200).json({ status: 'fallback', message: 'Supabase not configured. Using local fallback.' });
  }

  // 1. GET: Load checklists for a specific date and store
  if (req.method === 'GET') {
    const { date, store } = req.query;

    if (!date || !store) {
      return res.status(400).json({ error: 'Missing date or store query parameter.' });
    }

    try {
      let query = supabase
        .from('checklists_completados')
        .select('*')
        .eq('date', date);

      if (store !== 'Todas') {
        query = query.eq('store', store);
      }

      const { data, error } = await query;

      if (error) {
        // If the table doesn't exist, we return fallback rather than 500
        if (
          error.code === 'P0001' || 
          error.message.includes('relation "checklists_completados" does not exist') ||
          error.message.includes('Could not find the table') ||
          error.message.includes('schema cache')
        ) {
          return res.status(200).json({ status: 'fallback', message: 'Table does not exist. Using fallback.' });
        }
        throw error;
      }

      return res.status(200).json({
        status: 'success',
        records: data.map(r => ({
          taskId: r.task_id,
          completado: r.completado,
          evidencia: r.evidencia,
          colaborador: r.colaborador,
          date: r.date,
          store: r.store
        }))
      });
    } catch (err) {
      console.error('[checklists GET] Error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // 2. POST: Upsert checklist completion status and evidence
  if (req.method === 'POST') {
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
      return res.status(400).json({ error: 'Invalid JSON request body.' });
    }

    const { taskId, date, completado, evidencia, colaborador, store } = body;

    if (!taskId || !date || !colaborador || !store) {
      return res.status(400).json({ error: 'Missing required parameters: taskId, date, colaborador, store.' });
    }

    try {
      const { data, error } = await supabase
        .from('checklists_completados')
        .upsert({
          task_id: taskId,
          date: date,
          completado: completado,
          evidencia: evidencia || null,
          colaborador: colaborador,
          store: store
        }, { onConflict: 'task_id,date,store' });

      if (error) {
        if (
          error.code === 'P0001' || 
          error.message.includes('relation "checklists_completados" does not exist') ||
          error.message.includes('Could not find the table') ||
          error.message.includes('schema cache')
        ) {
          return res.status(200).json({ status: 'fallback', message: 'Table does not exist. Using fallback.' });
        }
        throw error;
      }

      return res.status(200).json({ status: 'success', message: 'Checklist updated successfully.' });
    } catch (err) {
      console.error('[checklists POST] Error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
