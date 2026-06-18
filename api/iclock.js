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
  const sn = query.SN || ''; // Device Serial Number
  const table = query.table || ''; // e.g., ATTLOG

  console.log(`[iClock ADMS] Request received. Method: ${method}, Path: ${req.url}, SN: ${sn}`);

  // 1. HANDSHAKE / OPTIONS QUERY (GET /iclock/cdata)
  if (method === 'GET') {
    res.setHeader('Content-Type', 'text/plain');
    
    // Return standard iClock device configuration options to authenticate the device
    const configResponse = 
      `RegistryCode=${sn || 'DON-GUTO-M1'}\n` +
      `Delay=10\n` +
      `TransInterval=5\n` +
      `TransTimes=00:00;\n` +
      `ServerVer=1.1.0\n`;
      
    return res.status(200).send(configResponse);
  }

  // 2. DATA PUSH / UPLOAD (POST /iclock/cdata)
  if (method === 'POST') {
    // Read raw text body from ZKTeco device
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    await new Promise(resolve => req.on('end', resolve));
    console.log(`[iClock ADMS] Raw Data received from SN ${sn}:\n`, body);

    // Parse the body if it is an attendance log upload (ATTLOG)
    if (table.toUpperCase() === 'ATTLOG' || body.includes('ATTLOG') || body.includes('\t')) {
      const lines = body.split('\n');
      
      lines.forEach(line => {
        const cleanLine = line.trim();
        if (!cleanLine || cleanLine.startsWith('PIN') || cleanLine.startsWith('ATTLOG')) return;

        // ZK iClock tab-delimited or space-delimited log formats:
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

          // Insert into global memory for real-time client sync
          global.latestPunches.push(punch);

          // Persist to Supabase if config exists
          if (supabase) {
            // Convert timestamp "YYYY-MM-DD HH:MM:SS" to ISO
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

      // Keep array size bounded to prevent memory leaks in the Node runtime container
      if (global.latestPunches.length > 200) {
        global.latestPunches = global.latestPunches.slice(-100);
      }
    }

    // Acknowledge receipt of data to ZKTeco device (must return plain text "OK")
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send('OK\n');
  }

  // Fallback
  res.setHeader('Content-Type', 'text/plain');
  return res.status(200).send('OK\n');
}
