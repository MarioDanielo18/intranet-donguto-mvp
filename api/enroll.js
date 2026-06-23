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

  // A. GET: Check command status
  if (req.method === 'GET') {
    const { action, commandId } = req.query;
    
    if (action === 'status') {
      if (!commandId) {
        return res.status(400).json({ error: 'Missing commandId parameter.' });
      }

      try {
        const { data, error } = await supabase
          .from('comandos_biometricos')
          .select('status, response_text, updated_at')
          .eq('command_id', commandId)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          return res.status(404).json({ error: 'Command not found.' });
        }

        return res.status(200).json({
          status: 'success',
          commandId: commandId,
          commandStatus: data.status, // PENDING, SENT, COMPLETED, FAILED
          responseText: data.response_text
        });

      } catch (err) {
        console.error('[api/enroll status] Error:', err);
        return res.status(500).json({ error: err.message });
      }
    }

    return res.status(400).json({ error: 'Invalid action parameter.' });
  }

  // B. POST: Queue a new enrollment command
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

    const { action, dni, fingerId, deviceSn, punches } = body;

    if (action === 'clear_imported') {
      try {
        const { error } = await supabase
          .from('asistencia_biometrica')
          .delete()
          .eq('device_id', 'ZLINK-IMPORT');

        if (error) throw error;

        return res.status(200).json({
          status: 'success',
          message: 'Successfully cleared all Excel-imported records from the database.'
        });
      } catch (err) {
        console.error('[api/enroll clear_imported] Error:', err);
        return res.status(500).json({ error: err.message });
      }
    }

    if (action === 'import') {
      if (!Array.isArray(punches) || punches.length === 0) {
        return res.status(400).json({ error: 'Missing or empty punches array.' });
      }

      const punchesToSave = punches.map(p => {
        const timestampIso = new Date(p.timestamp).toISOString();
        return {
          punch_id: p.punch_id || `IMP-${p.biometric_id}-${new Date(p.timestamp).getTime()}-${Math.random().toString().slice(-4)}`,
          biometric_id: String(p.biometric_id).trim(),
          timestamp: timestampIso,
          device_id: String(p.device_id || 'ZLINK-IMPORT').trim(),
          device_name: String(p.device_name || 'ZKBio Zlink Portal').trim()
        };
      });

      try {
        const { data, error } = await supabase
          .from('asistencia_biometrica')
          .upsert(punchesToSave, { onConflict: 'punch_id' });

        if (error) throw error;

        console.log(`[api/enroll import] Bulk imported/upserted ${punchesToSave.length} records into Supabase`);
        return res.status(200).json({
          status: 'success',
          message: `Successfully imported ${punchesToSave.length} biometric attendance records.`,
          count: punchesToSave.length
        });

      } catch (err) {
        console.error('[api/enroll import] Error:', err);
        return res.status(500).json({ error: err.message });
      }
    }

    if (action === 'create') {
      if (!dni || fingerId === undefined || !deviceSn) {
        return res.status(400).json({ error: 'Missing parameters: dni, fingerId, and deviceSn are required.' });
      }

      const cleanDni = String(dni).trim();
      const cleanSn = String(deviceSn).trim();
      const commandId = `CMD-${Date.now()}-${Math.random().toString().slice(-4)}`;
      
      // Standard ZKTeco ADMS Enroll Command
      const commandText = `ENROLLFP Pin=${cleanDni} FingerID=${fingerId}`;

      try {
        // First delete any pending enroll commands for this device to prevent command congestion
        await supabase
          .from('comandos_biometricos')
          .delete()
          .eq('device_sn', cleanSn)
          .eq('status', 'PENDING');

        // Insert new command
        const { data, error } = await supabase
          .from('comandos_biometricos')
          .insert([{
            device_sn: cleanSn,
            command_id: commandId,
            command_text: commandText,
            status: 'PENDING',
            finger_id: Number(fingerId),
            dni: cleanDni
          }]);

        if (error) throw error;

        console.log(`[api/enroll create] Queued enroll command ${commandId} for ZKTeco SN ${cleanSn}`);
        return res.status(200).json({
          status: 'success',
          message: 'Enrollment command successfully queued in Supabase.',
          commandId: commandId
        });

      } catch (err) {
        console.error('[api/enroll create] Error:', err);
        return res.status(500).json({ error: err.message });
      }
    }

    return res.status(400).json({ error: 'Invalid action parameter.' });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
