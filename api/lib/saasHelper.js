export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Tenant-Slug');
}

export async function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error('Invalid JSON request body'));
      }
    });
    req.on('error', reject);
  });
}

export function sendSuccess(res, payload = {}, statusCode = 200) {
  return res.status(statusCode).json({
    status: 'success',
    ...payload
  });
}

export function sendError(res, message = 'Internal Server Error', statusCode = 500) {
  return res.status(statusCode).json({
    status: 'error',
    error: message
  });
}
