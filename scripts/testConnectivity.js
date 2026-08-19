import https from 'https';

const options = {
  hostname: 'jchpxowbxxfrivrloqkg.supabase.co',
  port: 443,
  path: '/rest/v1/usuarios?select=*',
  method: 'GET',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjaHB4b3dieHhmcml2cmxvcWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MTU1NzQsImV4cCI6MjA5NzM5MTU3NH0.8utAjJJ5lmGnsIfPK3kNzSwpyPVtCiwfzmz5esMzipo',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjaHB4b3dieHhmcml2cmxvcWtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTgxNTU3NCwiZXhwIjoyMDk3MzkxNTc0fQ.2IbrGKbj6tDI8i85_4_H0TI7p3eJkj7wergl726N8pY'
  }
};

const req = https.request(options, (res) => {
  console.log('StatusCode:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Response payload:', data.substring(0, 500));
  });
});

req.on('error', (e) => {
  console.error('HTTPS Error:', e);
});

req.end();
