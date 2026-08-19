import { getSupabaseServer } from './lib/supabaseServer.js';
import { setCorsHeaders, parseJsonBody, sendSuccess, sendError } from './lib/saasHelper.js';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabase = getSupabaseServer();

  if (!supabase) {
    return sendSuccess(res, { status: 'fallback', message: 'Supabase not configured. Using local fallback.' });
  }

  // 1. GET: Load checklists for a specific date and store
  if (req.method === 'GET') {
    const { date, store, organizationId } = req.query;

    if (!date || !store) {
      return sendError(res, 'Missing date or store query parameter.', 400);
    }

    try {
      let query = supabase.from('checklists_completados').select('*');

      if (date && date !== 'all' && date !== 'TODOS') {
        if (date.length === 7) {
          query = query.gte('date', `${date}-01`).lte('date', `${date}-31`);
        } else {
          query = query.eq('date', date);
        }
      }

      if (store && store !== 'Todas') {
        query = query.eq('store', store);
      }

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }

      const { data, error } = await query;

      if (error) {
        if (
          error.code === 'P0001' || 
          error.message.includes('relation "checklists_completados" does not exist') ||
          error.message.includes('Could not find the table') ||
          error.message.includes('schema cache')
        ) {
          return sendSuccess(res, { status: 'fallback', message: 'Table does not exist. Using fallback.' });
        }
        throw error;
      }

      return sendSuccess(res, {
        records: (data || []).map(r => ({
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
      return sendError(res, err.message, 500);
    }
  }

  // 2. POST: Upsert checklist completion status and evidence
  if (req.method === 'POST') {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch (e) {
      return sendError(res, 'Invalid JSON request body.', 400);
    }

    const { taskId, date, completado, evidencia, colaborador, store, organizationId } = body;

    // Security Hardening: Server-side validation
    if (!taskId || typeof taskId !== 'string' || taskId.length > 100) {
      return sendError(res, 'Invalid or missing parameter: taskId', 400);
    }
    if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return sendError(res, 'Invalid or missing parameter: date (expected YYYY-MM-DD)', 400);
    }
    if (typeof completado !== 'boolean') {
      return sendError(res, 'Invalid or missing parameter: completado', 400);
    }
    if (evidencia !== null && evidencia !== undefined && typeof evidencia !== 'string') {
      return sendError(res, 'Invalid parameter: evidencia', 400);
    }
    if (!colaborador || typeof colaborador !== 'string' || colaborador.length > 100) {
      return sendError(res, 'Invalid or missing parameter: colaborador', 400);
    }
    if (!store || typeof store !== 'string' || store.length > 100) {
      return sendError(res, 'Invalid or missing parameter: store', 400);
    }

    try {
      const payload = {
        task_id: taskId,
        date: date,
        completado: completado,
        evidencia: evidencia || null,
        colaborador: colaborador,
        store: store
      };

      if (organizationId) {
        payload.organization_id = organizationId;
      }

      const { error } = await supabase
        .from('checklists_completados')
        .upsert(payload, { onConflict: 'task_id,date,store' });

      if (error) {
        if (
          error.code === 'P0001' || 
          error.message.includes('relation "checklists_completados" does not exist') ||
          error.message.includes('Could not find the table') ||
          error.message.includes('schema cache')
        ) {
          return sendSuccess(res, { status: 'fallback', message: 'Table does not exist. Using fallback.' });
        }
        throw error;
      }

      return sendSuccess(res, { message: 'Checklist updated successfully.' });
    } catch (err) {
      console.error('[checklists POST] Error:', err);
      return sendError(res, err.message, 500);
    }
  }

  return sendError(res, 'Method not allowed.', 405);
}
