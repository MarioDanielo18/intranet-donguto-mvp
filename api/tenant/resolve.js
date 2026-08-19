import { getSupabaseServer } from '../lib/supabaseServer.js';
import { setCorsHeaders, sendSuccess, sendError } from '../lib/saasHelper.js';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { slug } = req.query;
  const targetSlug = (slug || 'don-guto').toLowerCase().trim();

  const supabase = getSupabaseServer();

  // If Supabase is not connected, return standard fallback tenant branding
  if (!supabase) {
    return sendSuccess(res, {
      tenant: {
        name: 'Don Guto Cafetería',
        slug: 'don-guto',
        logoUrl: '/favicon.svg',
        primaryColor: '#4F46E5',
        secondaryColor: '#10B981',
        stores: [
          { name: 'San Isidro (Jorge Basadre)', address: 'Av. Jorge Basadre Grohmann 487', mode: 'web_camera' },
          { name: 'Santa Catalina / La Victoria', address: 'Av. Nicolás Arriola 503', mode: 'web_camera' },
          { name: 'Barranco', address: 'Av. Almirante Miguel Grau 1640', mode: 'web_camera' }
        ]
      }
    });
  }

  try {
    const { data: org, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', targetSlug)
      .single();

    if (error || !org) {
      // Fallback default organization
      return sendSuccess(res, {
        tenant: {
          name: 'Don Guto Cafetería',
          slug: 'don-guto',
          logoUrl: '/favicon.svg',
          primaryColor: '#4F46E5',
          secondaryColor: '#10B981',
          stores: [
            { name: 'San Isidro (Jorge Basadre)', address: 'Av. Jorge Basadre Grohmann 487', mode: 'web_camera' },
            { name: 'Santa Catalina / La Victoria', address: 'Av. Nicolás Arriola 503', mode: 'web_camera' },
            { name: 'Barranco', address: 'Av. Almirante Miguel Grau 1640', mode: 'web_camera' }
          ]
        }
      });
    }

    // Fetch stores for this tenant
    const { data: stores } = await supabase
      .from('stores')
      .select('*')
      .eq('organization_id', org.id);

    return sendSuccess(res, {
      tenant: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        logoUrl: org.logo_url || '/favicon.svg',
        primaryColor: org.primary_color || '#4F46E5',
        secondaryColor: org.secondary_color || '#10B981',
        stores: (stores || []).map(s => ({
          id: s.id,
          name: s.name,
          address: s.address,
          mode: s.attendance_mode || 'web_camera'
        }))
      }
    });

  } catch (err) {
    console.error('[tenant-resolve-api] Error:', err);
    return sendError(res, err.message, 500);
  }
}
