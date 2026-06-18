// api/sync-zk.js
// Vercel Serverless Function to securely query ZKBio Zlink (Minerva IoT) cloud API
// and sync attendance logs directly to the Don Guto Intranet in real-time.

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Retrieve credentials from Vercel Environment Variables
  const appKey = process.env.ZKLINK_APP_KEY;
  const appSecret = process.env.ZKLINK_APP_SECRET;
  const tenantId = process.env.ZKLINK_TENANT_ID; // optional depending on ZLink API

  // Initialize global memory storage for real-time punches (shared with /api/iclock)
  global.latestPunches = global.latestPunches || [];

  // If credentials are not set in Vercel, return direct ADMS punches from global memory
  if (!appKey || !appSecret) {
    const directPunches = [...global.latestPunches];
    return res.status(200).json({
      status: 'success',
      message: 'Direct ZKTeco ADMS real-time punches synced.',
      punches: directPunches
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
