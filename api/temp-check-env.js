export default async function handler(req, res) {
  const envKeys = Object.keys(process.env);
  // Also check if any key contains DATABASE, POSTGRES, DB, or PASSWORD
  const filtered = {};
  envKeys.forEach(k => {
    if (k.includes('DATABASE') || k.includes('POSTGRES') || k.includes('DB') || k.includes('PASSWORD') || k.includes('SUPABASE')) {
      // Let's print the key and length of the value safely
      filtered[k] = {
        exists: !!process.env[k],
        length: process.env[k] ? process.env[k].length : 0,
        prefix: process.env[k] ? process.env[k].substring(0, 10) : ''
      };
    }
  });
  return res.status(200).json({
    envKeys,
    filtered
  });
}
