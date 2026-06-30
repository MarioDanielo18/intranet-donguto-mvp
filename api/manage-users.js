import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

  // Fallback mode if Supabase is not configured
  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({ status: 'fallback', message: 'Supabase not configured.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. GET ALL USERS (GET /api/manage-users)
  if (req.method === 'GET') {
    try {
      let { data: users, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Seed new production users if they are missing
      const onavarroExists = (users || []).some(u => u.username === 'onavarrodg');
      if (!onavarroExists) {
        console.log('[seeder] Seeding new users to Supabase...');
        const usersToSeed = [
          { username: 'onavarrodg', password: 'dg.osca.N9405', name: 'Oscar Navarro', role: 'Gerente', store: 'Todas' },
          { username: 'gechevarriadg', password: 'dg.gabr.E9087', name: 'Gabriela Echevarría', role: 'Gerente', store: 'Todas' },
          { username: 'cnizamadg', password: 'dg.chri.N9633', name: 'Christian Nizama', role: 'Administrador', store: '28 de Julio Miraflores' },
          { username: 'arianadg', password: 'dg.aria.A9928', name: 'Ariana', role: 'Auditor', store: '28 de Julio Miraflores' },
          { username: 'ccuevadg', password: 'dg.chri.C9458', name: 'Christian Cueva', role: 'Administrador', store: 'Todas' },
          { username: 'woviedodg', password: 'dg.wilf.O9580', name: 'Wilfredo Oviedo', role: 'Auditor', store: 'Todas' },
          { username: 'jortizdg', password: 'dg.juan.O9040', name: 'Juan Ortiz', role: 'Administrador', store: 'Todas' },
          
          { username: 'avasquezdg', password: 'dg.alex.V38314', name: 'Alexander Vásquez Villalobos', role: 'Servicio', store: '28 de Julio Miraflores', email: 'Alexito1836@gmail.com', telefono: '992838314' },
          { username: 'ddazadg', password: 'dg.daye.D65912', name: 'Dayerlin Carolina Daza Vargas', role: 'Barista', store: '28 de Julio Miraflores', email: 'dayerlincarolina.dv@gmail.com', telefono: '963365912' },
          { username: 'mbravodg', password: 'dg.moni.B75773', name: 'Mónica Daniela Bravo Rodríguez', role: 'Servicio', store: '28 de Julio Miraflores', email: 'Monikbrav7@gmail.com', telefono: '908757732' },
          { username: 'aocampodg', password: 'dg.alex.O37809', name: 'Alexis Ocampo Rodríguez', role: 'Cocina', store: '28 de Julio Miraflores', email: 'Alexisjo@gmail.com', telefono: '945837809' },
          { username: 'fsotodg', password: 'dg.fran.S04464', name: 'Franchesca Giovana Soto Chávez', role: 'Cocina', store: '28 de Julio Miraflores', email: 'fgschavez@gmail.com', telefono: '958004464' },
          { username: 'eegocheagadg', password: 'dg.emil.E54227', name: 'Emily Egocheaga Ormeño', role: 'Cocina', store: '28 de Julio Miraflores', email: 'egocheaga888@gmail.com', telefono: '904054227' },
          { username: 'psilvadg', password: 'dg.patr.S26393', name: 'Patrick Silva Chávez', role: 'Barista', store: '28 de Julio Miraflores', email: 'murciegus@gmail.com', telefono: '979526393' },
          { username: 'jaymadg', password: 'dg.jesu.A22582', name: 'Jesus Ayma Chaparro', role: 'Barista', store: '28 de Julio Miraflores', email: 'jesusaymachaparro@gmail.com', telefono: '912322582' },
          { username: 'rlaurentedg', password: 'dg.ruth.L53898', name: 'Ruth Sarahi Laurente Olivera', role: 'Barista', store: '28 de Julio Miraflores', email: 'Sarahilaurente.7@gmail.com', telefono: '982953898' }
        ];

        for (const userToSeed of usersToSeed) {
          const exists = (users || []).some(u => u.username === userToSeed.username);
          if (!exists) {
            await supabase.from('usuarios').insert([{
              username: userToSeed.username,
              password: userToSeed.password,
              name: userToSeed.name,
              role: userToSeed.role,
              store: userToSeed.store,
              email: userToSeed.email || null,
              telefono: userToSeed.telefono || null
            }]);
          }
        }

        // Re-fetch users after seeding
        const { data: updatedUsers } = await supabase
          .from('usuarios')
          .select('*')
          .order('created_at', { ascending: true });

        if (updatedUsers) {
          users = updatedUsers;
        }
      }

      // Ensure Christian Cueva has the correct Administrador role if previously seeded
      const ccueva = (users || []).find(u => u.username === 'ccuevadg');
      if (ccueva && ccueva.role === 'Cocina') {
        console.log('[seeder] Updating Christian Cueva role to Administrador in Supabase...');
        await supabase
          .from('usuarios')
          .update({ role: 'Administrador' })
          .eq('username', 'ccuevadg');
        
        // Re-fetch users to keep local array up to date
        const { data: refreshedUsers } = await supabase
          .from('usuarios')
          .select('*')
          .order('created_at', { ascending: true });
        if (refreshedUsers) {
          users = refreshedUsers;
        }
      }

      return res.status(200).json({
        status: 'success',
        users: users.map(u => ({
          username: u.username,
          password: u.password, // return password for Técnico management panel
          name: u.name,
          apellidos: u.apellidos || '',
          dni: u.dni || '',
          email: u.email || '',
          telefono: u.telefono || '',
          role: u.role,
          store: u.store,
          biometricId: u.biometric_id || null
        }))
      });
    } catch (err) {
      console.error('[manage-users GET] Error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // 2. MUTATION OPERATIONS (POST /api/manage-users)
  if (req.method === 'POST') {
    // Read body
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
      return res.status(400).json({ error: 'Invalid JSON request body' });
    }

    const { action, username, password, name, role, store, biometricId } = body;
    if (!action) {
      return res.status(400).json({ error: 'action parameter is required' });
    }

    try {
      // Action: CREATE
      if (action === 'create') {
        if (!username || !password || !name || !role || !store) {
          return res.status(400).json({ error: 'Missing user parameters' });
        }
        const { data, error } = await supabase
          .from('usuarios')
          .insert([{
            username: username.toLowerCase().trim(),
            password: password.trim(),
            name: name.trim(),
            apellidos: body.apellidos ? body.apellidos.trim() : null,
            dni: body.dni ? body.dni.trim() : null,
            email: body.email ? body.email.trim() : null,
            telefono: body.telefono ? body.telefono.trim() : null,
            role: role,
            store: store,
            biometric_id: biometricId || null
          }]);

        if (error) throw error;
        return res.status(200).json({ status: 'success', message: 'User created successfully' });
      }

      // Action: UPDATE
      if (action === 'update') {
        if (!username) {
          return res.status(400).json({ error: 'username parameter is required' });
        }

        const updateFields = {};
        if (password !== undefined) updateFields.password = password.trim();
        if (name !== undefined) updateFields.name = name.trim();
        if (body.apellidos !== undefined) updateFields.apellidos = body.apellidos ? body.apellidos.trim() : null;
        if (body.dni !== undefined) updateFields.dni = body.dni ? body.dni.trim() : null;
        if (body.email !== undefined) updateFields.email = body.email ? body.email.trim() : null;
        if (body.telefono !== undefined) updateFields.telefono = body.telefono ? body.telefono.trim() : null;
        if (role !== undefined) updateFields.role = role;
        if (store !== undefined) updateFields.store = store;
        if (biometricId !== undefined) updateFields.biometric_id = biometricId || null;

        const { error } = await supabase
          .from('usuarios')
          .update(updateFields)
          .eq('username', username.toLowerCase().trim());

        if (error) throw error;
        return res.status(200).json({ status: 'success', message: 'User updated successfully' });
      }

      // Action: DELETE
      if (action === 'delete') {
        if (!username) {
          return res.status(400).json({ error: 'username parameter is required' });
        }

        const { error } = await supabase
          .from('usuarios')
          .delete()
          .eq('username', username.toLowerCase().trim());

        if (error) throw error;
        return res.status(200).json({ status: 'success', message: 'User deleted successfully' });
      }

      return res.status(400).json({ error: 'Invalid action: ' + action });

    } catch (err) {
      console.error(`[manage-users POST action=${action}] Error:`, err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
