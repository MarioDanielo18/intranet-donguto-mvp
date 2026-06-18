import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. TRY SUPABASE FIRST (DIRECT ADMS PERSISTENT SYNC)
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Query the latest 100 attendance punches
      const { data: records, error } = await supabase
        .from('asistencia_biometrica')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Map Supabase records to the format expected by the frontend React app
      const punches = (records || []).map(r => {
        const punchTime = new Date(r.timestamp);
        
        // Format to HH:MM AM/PM local time for display
        const hours = punchTime.getHours();
        const minutes = punchTime.getMinutes();
        const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
        const displayMinutes = minutes.toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const timeStr = `${displayHours.toString().padStart(2, '0')}:${displayMinutes} ${ampm}`;
        const dateStr = punchTime.toISOString().split('T')[0];

        return {
          punch_id: r.punch_id,
          biometric_id: String(r.biometric_id),
          time: timeStr,
          date: dateStr,
          device_id: r.device_id || 'DEV-001',
          device_name: r.device_name || 'ZKTeco M1'
        };
      });

      return res.status(200).json({
        status: 'success',
        message: 'Successfully synced punches from Supabase cloud database.',
        punches: punches
      });
    } catch (dbError) {
      console.error('[sync-zk] Supabase query failed, falling back to other sync modes:', dbError);
    }
  }

  // 2. FALLBACK TO OTHER MODES
  const appKey = process.env.ZKLINK_APP_KEY;
  const appSecret = process.env.ZKLINK_APP_SECRET;
  const tenantId = process.env.ZKLINK_TENANT_ID; // optional depending on ZLink API

  // Initialize global memory storage for real-time punches (shared with /api/iclock)
  global.latestPunches = global.latestPunches || [];

  // If credentials are not set in Vercel, return direct ADMS punches from global memory
  if (!appKey || !appSecret) {
    const punches = [...global.latestPunches].map(p => {
      // p.timestamp is "YYYY-MM-DD HH:MM:SS"
      const parts = p.timestamp.split(' ');
      const dateStr = parts[0];
      const timePart = parts[1];
      
      const [hStr, mStr] = timePart.split(':');
      let hours = parseInt(hStr);
      const minutes = mStr;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
      const timeStr = `${displayHours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

      return {
        punch_id: p.punch_id,
        biometric_id: p.biometric_id,
        time: timeStr,
        date: dateStr,
        device_id: p.device_id,
        device_name: p.device_name
      };
    });

    return res.status(200).json({
      status: 'success',
      message: 'Direct ZKTeco ADMS real-time punches synced (In-Memory Fallback).',
      punches: punches
    });
  }

  try {
    // 1. AUTHENTICATE WITH ZKBIO ZLINK (MINERVA IoT)
    // ZKBio Zlink uses token-based authentication. First, request a token:
    const authUrl = 'https://api.minervaiot.com/oauth/token'; // standard Minerva IoT OAuth URL
    
    // We make a request to ZLink auth endpoint
    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: appKey,
        client_secret: appSecret,
        tenant_id: tenantId || ''
      })
    });

    if (!authResponse.ok) {
      const errText = await authResponse.text();
      throw new Error(`Authentication with ZKBio Zlink failed: ${errText}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token; // token valid for session queries

    // 2. FETCH LATEST PUNCH RECORDS FOR TODAY
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // format YYYY-MM-DD
    
    // ZKBio Zlink API endpoint to query attendance logs
    // Query parameters normally specify start_time, end_time, page and limit
    const punchUrl = `https://api.minervaiot.com/v1/attendance/punch-records?date=${todayStr}&limit=50`;

    const punchResponse = await fetch(punchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!punchResponse.ok) {
      const errText = await punchResponse.text();
      throw new Error(`Failed to fetch punch records: ${errText}`);
    }

    const punchData = await punchResponse.json();
    
    // Parse the records to match the intranet structure
    // ZLink returns fields: person_id (biometric_id), punch_time, device_id, device_name
    const punches = (punchData.records || []).map(r => {
      const punchTime = new Date(r.punch_time);
      const hours = punchTime.getHours();
      const minutes = punchTime.getMinutes();
      const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
      const displayMinutes = minutes.toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const timeStr = `${displayHours.toString().padStart(2, '0')}:${displayMinutes} ${ampm}`;

      return {
        punch_id: r.id || `ZK-${r.person_id}-${punchTime.getTime()}`,
        biometric_id: String(r.person_id),
        username: r.username || '',
        time: timeStr,
        date: r.punch_time.split('T')[0],
        device_id: r.device_id || 'DEV-001',
        device_name: r.device_name || 'ZKTeco M1'
      };
    });

    return res.status(200).json({
      status: 'success',
      message: 'Successfully synced punches from ZKBio Zlink AWS Cloud.',
      punches: punches
    });

  } catch (error) {
    console.error('Error in sync-zk function:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}
