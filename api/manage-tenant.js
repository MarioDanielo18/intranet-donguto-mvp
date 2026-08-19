import { getSupabaseServer } from './lib/supabaseServer.js';
import { setCorsHeaders, parseJsonBody, sendSuccess, sendError } from './lib/saasHelper.js';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabase = getSupabaseServer();

  if (!supabase) {
    return sendError(res, 'Database connection not available', 500);
  }

  // 1. GET: Fetch list of tenants (for SuperAdmin dashboard) or tenant details by slug
  if (req.method === 'GET') {
    const { slug } = req.query;

    try {
      if (slug) {
        const { data: org, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('slug', slug.toLowerCase().trim())
          .single();

        if (error || !org) {
          return sendError(res, 'Organización no encontrada', 404);
        }

        const { data: stores } = await supabase
          .from('stores')
          .select('*')
          .eq('organization_id', org.id);

        return sendSuccess(res, {
          organization: org,
          stores: stores || []
        });
      }

      // Fetch all registered organizations (SuperAdmin overview)
      const { data: orgs, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return sendSuccess(res, { organizations: orgs || [] });
    } catch (err) {
      console.error('[manage-tenant GET] Error:', err);
      return sendError(res, err.message, 500);
    }
  }

  // 2. POST: Self-Service Restaurant Onboarding (Auto-Registro de Empresa)
  if (req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const {
        organizationName,
        slug,
        logoUrl,
        primaryColor,
        secondaryColor,
        adminName,
        adminUsername,
        adminEmail,
        adminPassword,
        adminTelefono,
        stores // Array of store names e.g. ["Sede Principal", "Sede Miraflores"]
      } = body;

      // Validation
      if (!organizationName || !slug) {
        return sendError(res, 'Nombre de la organización y slug son obligatorios', 400);
      }
      if (!adminUsername || !adminPassword || !adminName) {
        return sendError(res, 'Datos del administrador (nombre, usuario y contraseña) son obligatorios', 400);
      }

      const formattedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');

      // Check if slug already exists
      const { data: existingOrg } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', formattedSlug)
        .single();

      if (existingOrg) {
        return sendError(res, `El identificador de marca "${formattedSlug}" ya está registrado en Culinaria.net.pe`, 400);
      }

      // Insert new Organization
      const { data: newOrg, error: orgErr } = await supabase
        .from('organizations')
        .insert([{
          name: organizationName,
          slug: formattedSlug,
          logo_url: logoUrl || '/favicon.svg',
          primary_color: primaryColor || '#4F46E5',
          secondary_color: secondaryColor || '#10B981',
          status: 'Activa'
        }])
        .select()
        .single();

      if (orgErr || !newOrg) {
        throw orgErr || new Error('No se pudo crear la organización');
      }

      const orgId = newOrg.id;

      // Insert Stores (Branches)
      const storesToInsert = (stores && stores.length > 0)
        ? stores.map(s => ({
            organization_id: orgId,
            name: typeof s === 'string' ? s : s.name,
            address: typeof s === 'object' ? s.address : '',
            attendance_mode: 'web_camera'
          }))
        : [{ organization_id: orgId, name: 'Sede Principal', attendance_mode: 'web_camera' }];

      const { data: createdStores } = await supabase
        .from('stores')
        .insert(storesToInsert)
        .select();

      // Insert Admin User for the Tenant
      const { data: adminUser, error: userErr } = await supabase
        .from('usuarios')
        .insert([{
          organization_id: orgId,
          store_name: 'Todas',
          username: adminUsername.toLowerCase().trim(),
          password_hash: adminPassword,
          name: adminName,
          email: adminEmail || null,
          telefono: adminTelefono || null,
          role: 'Administrador',
          status: 'Activo'
        }])
        .select()
        .single();

      if (userErr) {
        console.warn('[manage-tenant POST] Warning creating admin user:', userErr.message);
      }

      // Seed default operational checklist templates for the new restaurant
      const defaultChecklistTemplates = [
        { organization_id: orgId, area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Colocarse el uniforme correctamente y registrar foto de ingreso con timestamp.', requiere_foto: true },
        { organization_id: orgId, area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Encender la máquina de espresso y molino. Verificar temperatura.', requiere_foto: true },
        { organization_id: orgId, area: 'COCINA', tipo_turno: 'APERTURA', descripcion: 'Encender equipos de cocina y verificar higiene de superficies.', requiere_foto: true },
        { organization_id: orgId, area: 'SERVICIO', tipo_turno: 'APERTURA', descripcion: 'Revisar menaje, limpieza de salón y desinfección de mesas.', requiere_foto: true },
        { organization_id: orgId, area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Limpiar máquina de espresso, apagar equipos y dejar vajilla lavada.', requiere_foto: true },
        { organization_id: orgId, area: 'COCINA', tipo_turno: 'CIERRE', descripcion: 'Apagar hornos/freidoras y desinfectar estación de trabajo.', requiere_foto: true }
      ];

      await supabase.from('checklist_templates').insert(defaultChecklistTemplates);

      return sendSuccess(res, {
        message: '¡Restaurante registrado exitosamente en Culinaria.net.pe!',
        organization: newOrg,
        stores: createdStores || [],
        adminUser: {
          id: adminUser?.id,
          username: adminUser?.username,
          name: adminUser?.name,
          role: adminUser?.role
        }
      }, 201);

    } catch (err) {
      console.error('[manage-tenant POST] Error:', err);
      return sendError(res, err.message, 500);
    }
  }

  return sendError(res, 'Method not allowed', 405);
}
