import { createClient } from '@supabase/supabase-js';

// Initialize global memory storage for real-time punch synchronization
global.latestPunches = global.latestPunches || [];

// Initialize Supabase Client if environment variables are provided
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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query, method } = req;
  const urlPath = req.url || '';
  const sn = query.SN || ''; // Device Serial Number
  const table = query.table || ''; // e.g., ATTLOG

  console.log(`[iClock ADMS] Request received. Method: ${method}, Path: ${urlPath}, SN: ${sn}`);

  // =======================================================
  // 1. GET REQUESTS (Handshake & Command Polling)
  // =======================================================
  if (method === 'GET') {
    res.setHeader('Content-Type', 'text/plain');

    // A. COMMAND POLL: Device asks for commands (?SN=xxx)
    if (urlPath.includes('/getrequest')) {
      if (!supabase || !sn) {
        return res.status(200).send('OK\n');
      }

      try {
        // Find the oldest pending command for this device SN
        const { data: cmd, error } = await supabase
          .from('comandos_biometricos')
          .select('*')
          .eq('device_sn', sn)
          .eq('status', 'PENDING')
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (cmd) {
          // Update status to SENT so the device can process it
          await supabase
            .from('comandos_biometricos')
            .update({ status: 'SENT', updated_at: new Date().toISOString() })
            .eq('id', cmd.id);

          console.log(`[iClock ADMS] Sent command ${cmd.command_id} to device ${sn}: ${cmd.command_text}`);
          // ADMS command format: C:command_id:command_text
          return res.status(200).send(`C:${cmd.command_id}:${cmd.command_text}\n`);
        }
      } catch (err) {
        console.error('[iClock ADMS] Command poll database error:', err);
      }

      return res.status(200).send('OK\n');
    }

    // B. HANDSHAKE / OPTIONS: Default handshake configuration
    const configResponse = 
      `RegistryCode=${sn || 'DON-GUTO-M1'}\n` +
      `Delay=10\n` +
      `TransInterval=5\n` +
      `TransTimes=00:00;\n` +
      `ServerVer=1.1.0\n`;
      
    return res.status(200).send(configResponse);
  }

  // =======================================================
  // 2. POST REQUESTS (Logs Push & Command Results)
  // =======================================================
  if (method === 'POST') {
    // A. COMMAND RESULT: Device returns execution result
    if (urlPath.includes('/devicecmd')) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      await new Promise(resolve => req.on('end', resolve));
      console.log(`[iClock ADMS] Command result received from SN ${sn}:\n`, body);

      res.setHeader('Content-Type', 'text/plain');
      if (!supabase) {
        return res.status(200).send('OK\n');
      }

      try {
        // Parse ID=xxx&Return=0 format
        const normalized = body.trim().replace(/\r/g, '').replace(/\n/g, '&');
        const params = new URLSearchParams(normalized);
        const commandId = params.get('ID');
        const returnCode = params.get('Return');

        if (commandId) {
          const status = returnCode === '0' ? 'COMPLETED' : 'FAILED';
          await supabase
            .from('comandos_biometricos')
            .update({ 
              status: status, 
              response_text: body, 
              updated_at: new Date().toISOString() 
            })
            .eq('command_id', commandId);
          
          console.log(`[iClock ADMS] Updated command ${commandId} to status ${status}`);
        }
      } catch (err) {
        console.error('[iClock ADMS] Command result parse error:', err);
      }

      return res.status(200).send('OK\n');
    }

    // B. ATTENDANCE DATA UPLOAD: Device pushes punches (ATTLOG)
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    await new Promise(resolve => req.on('end', resolve));
    console.log(`[iClock ADMS] Raw Data received from SN ${sn}:\n`, body);

    if (table.toUpperCase() === 'ATTLOG' || body.includes('ATTLOG') || body.includes('\t')) {
      const lines = body.split('\n');
      
      lines.forEach(line => {
        const cleanLine = line.trim();
        if (!cleanLine || cleanLine.startsWith('PIN') || cleanLine.startsWith('ATTLOG')) return;

        // Format: [BiometricID/PIN]  [Timestamp YYYY-MM-DD HH:MM:SS]  [Status]  [Workcode] ...
        const parts = cleanLine.split(/\s+/);
        if (parts.length >= 2) {
          const biometricId = parts[0];
          const dateStr = parts[1];
          const timeStr = parts[2];
          const timestamp = `${dateStr} ${timeStr}`;

          console.log(`[iClock ADMS] Parsed Attendance Punch. Biometric ID: ${biometricId}, Time: ${timestamp}`);

          const punch = {
            punch_id: `ZK-${biometricId}-${Date.now()}-${Math.random().toString().slice(-4)}`,
            biometric_id: String(biometricId),
            timestamp: timestamp,
            device_id: sn || 'DEV-001',
            device_name: `ZKTeco M1 (SN: ${sn})`
          };

          // Insert into global memory for real-time client sync fallback
          global.latestPunches.push(punch);

          // Persist to Supabase
          if (supabase) {
            let isoTimestamp;
            try {
              isoTimestamp = new Date(timestamp.replace(' ', 'T') + 'Z').toISOString();
            } catch (e) {
              isoTimestamp = new Date().toISOString();
            }

            supabase.from('asistencia_biometrica').insert([{
              punch_id: punch.punch_id,
              biometric_id: punch.biometric_id,
              timestamp: isoTimestamp,
              device_id: punch.device_id,
              device_name: punch.device_name
            }]).then(({ error }) => {
              if (error) console.error('[iClock ADMS] Supabase Save Error:', error);
              else console.log('[iClock ADMS] Punch persisted to Supabase:', punch.punch_id);
            }).catch(err => {
              console.error('[iClock ADMS] Supabase connection error:', err);
            });
          }
        }
      });

      if (global.latestPunches.length > 200) {
        global.latestPunches = global.latestPunches.slice(-100);
      }
    }

    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send('OK\n');
  }

  res.setHeader('Content-Type', 'text/plain');
  return res.status(200).send('OK\n');
}
