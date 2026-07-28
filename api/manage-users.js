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
    const { cleanup } = req.query;
    if (cleanup === 'true') {
      try {
        console.log('[cleanup] Wiping checklists, attendance logs, and legacy mocks from Supabase...');
        await supabase
          .from('checklists_completados')
          .delete()
          .neq('date', '1970-01-01');

        await supabase
          .from('asistencia_biometrica')
          .delete()
          .neq('timestamp', '1970-01-01');

        // Clean up legacy mock accounts in Supabase
        await supabase
          .from('usuarios')
          .delete()
          .in('username', [
            'vrojasdg', 'sgomezdg', 'dongutodg', 'mquispedg', 'tecnicodg', 'auditordg', 'qlopezdg',
            'mcastrodg', 'aruizdg', 'rguerradg', 'fpinedodg', 'dortizdg', 'mortizdg', 'tsalasdg', 'sramosdg'
          ]);

        // Insert Mario Quispe Gerente and Técnico accounts
        await supabase.from('usuarios').upsert([
          { username: 'mquispedg', password: 'dg.mari.Q9008', name: 'Mario Quispe', role: 'Gerente', store: 'Todas' },
          { username: 'mquispetec', password: 'dg.mari.T8997', name: 'Mario Quispe (Técnico)', role: 'Técnico', store: 'Todas' }
        ], { onConflict: 'username' });

        return res.status(200).json({
          status: 'success',
          message: 'Base de datos Supabase limpiada correctamente. Checklists, asistencias y usuarios demo depurados; cuentas de Mario Quispe creadas.'
        });
      } catch (cleanupErr) {
        console.error('[cleanup] Error:', cleanupErr);
        return res.status(500).json({ error: cleanupErr.message });
      }
    }

    try {
      let { data: users, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Seed new production users if they are missing
      const onavarroExists = (users || []).some(u => u.username === 'onavarrodg');
      if (!onavarroExists) {
        console.log('[seeder] Seeding new users and cleaning legacy mocks in Supabase...');
        // Clean up legacy mock accounts in Supabase
        await supabase
          .from('usuarios')
          .delete()
          .in('username', [
            'vrojasdg', 'sgomezdg', 'dongutodg', 'mquispedg', 'tecnicodg', 'auditordg', 'qlopezdg',
            'mcastrodg', 'aruizdg', 'rguerradg', 'fpinedodg', 'dortizdg', 'mortizdg', 'tsalasdg', 'sramosdg'
          ]);

        const usersToSeed = [
          { username: 'onavarrodg', password: 'dg.osca.N9405', name: 'Oscar Navarro', role: 'Gerente', store: 'Todas' },
          { username: 'gechevarriadg', password: 'dg.gabr.E9087', name: 'Gabriela Echevarría', role: 'Gerente', store: 'Todas' },
          { username: 'cnizamadg', password: 'dg.chri.N9633', name: 'Christian Nizama', role: 'Administrador', store: '28 de Julio Miraflores', biometric_id: '44179147' },
          { username: 'arianadg', password: 'dg.aria.A9928', name: 'Ariana', role: 'Auditor', store: '28 de Julio Miraflores', biometric_id: '43588725' },
          { username: 'ccuevadg', password: 'dg.chri.C9458', name: 'Christian Cueva', role: 'Administrador', store: 'Todas' },
          { username: 'woviedodg', password: 'dg.wilf.O9580', name: 'Wilfredo Oviedo', role: 'Auditor', store: 'Todas', biometric_id: '41670259' },
          { username: 'jsisniegasdg', password: 'dg.john.S15832', name: 'John Sisniegas Toralba', role: 'Auditor', store: '28 de Julio Miraflores', email: 'john.sisniegas.t@gmail.com' },
          { username: 'jortizdg', password: 'dg.juan.O9040', name: 'Juan Ortiz', role: 'Administrador', store: 'Todas' },
          { username: 'mquispedg', password: 'dg.mari.Q9008', name: 'Mario Quispe', role: 'Gerente', store: 'Todas', biometric_id: '898691' },
          { username: 'mquispetec', password: 'dg.mari.T8997', name: 'Mario Quispe (Técnico)', role: 'Técnico', store: 'Todas' },
          
          { username: 'avasquezdg', password: 'dg.alex.V38314', name: 'Alexander Vásquez Villalobos', role: 'Servicio', store: '28 de Julio Miraflores', email: 'Alexito1836@gmail.com', telefono: '992838314', biometric_id: '61096401' },
          { username: 'mbravodg', password: 'dg.moni.B75773', name: 'Mónica Daniela Bravo Rodríguez', role: 'Servicio', store: '28 de Julio Miraflores', email: 'Monikbrav7@gmail.com', telefono: '908757732', biometric_id: '06587622' },
          { username: 'fsotodg', password: 'dg.fran.S04464', name: 'Franchesca Giovana Soto Chávez', role: 'Cocina', store: '28 de Julio Miraflores', email: 'fgschavez@gmail.com', telefono: '958004464', biometric_id: '72306939' },
          { username: 'psilvadg', password: 'dg.patr.S26393', name: 'Patrick Silva Chávez', role: 'Barista', store: '28 de Julio Miraflores', email: 'murciegus@gmail.com', telefono: '979526393' },
          { username: 'jaymadg', password: 'dg.jesu.A22582', name: 'Jesus Ayma Chaparro', role: 'Barista', store: '28 de Julio Miraflores', email: 'jesusaymachaparro@gmail.com', telefono: '912322582', biometric_id: '60979426' },
          { username: 'cvidaldg', password: 'dg.ciro.V85721', name: 'Ciro Svith Vidal Ignacio', role: 'Cocina', store: '28 de Julio Miraflores', biometric_id: '61268415' },
          { username: 'aolivosdg', password: 'dg.aria.O72619', name: 'Ariana Olivos', role: 'Servicio', store: '28 de Julio Miraflores', biometric_id: '147242' },
          { username: 'gusdg', password: 'dg.gus.G9012', name: 'Gus', role: 'Barista', store: '28 de Julio Miraflores' },

          // TIENDA ARRIOLA - LA VICTORIA
          { username: 'mlucerodg', password: 'dg.migu.L43278', name: 'Miguel Lucero Paredes', role: 'Barista', store: 'Arriola - La Victoria', telefono: '944543278' },
          { username: 'drodriguezdg', password: 'dg.dama.R85573', name: 'Damaris Rodriguez Navarro', role: 'Cocina', store: 'Arriola - La Victoria', telefono: '954188573' },
          { username: 'oataujedg', password: 'dg.omar.A18223', name: 'Omar Atauje Vargas', role: 'Barista', store: 'Arriola - La Victoria', telefono: '915918223' },
          { username: 'blossiodg', password: 'dg.brun.L99936', name: 'Brunella Lossio Duran', role: 'Servicio', store: 'Arriola - La Victoria', telefono: '972099936' },
          { username: 'smartinezdg', password: 'dg.sand.M42764', name: 'Sandro Martinez Peña', role: 'Cocina', store: 'Arriola - La Victoria', telefono: '988542764' },
          { username: 'srojasdg', password: 'dg.shar.R99069', name: 'Sharon Rojas Castro', role: 'Servicio', store: 'Arriola - La Victoria', telefono: '947799069' },
          { username: 'alaradg', password: 'dg.adri.L14568', name: 'Adrian Lara Hoyos', role: 'Servicio', store: 'Arriola - La Victoria', telefono: '938414568' },

          // SEDE BARRANCO
          { username: 'hugazdg', password: 'dg.hugo.U53034', name: 'Hugo César Ugaz Gálvez', role: 'Cocina', store: 'Barranco', email: 'cesarugaz010600l@gmail.com', telefono: '938853034' },
          { username: 'shuaylladg', password: 'dg.shak.H74355', name: 'Shakira Elfi Huaylla Donayres', role: 'Servicio', store: 'Barranco', email: 'Shakirahuaylla5@gmail.com', telefono: '923774355' },
          { username: 'lluyodg', password: 'dg.luis.L16565', name: 'Luis Daniel Luyo Arce', role: 'Cocina', store: 'Barranco', email: 'daniel_luyo@hotmail.com', telefono: '955516565' },
          { username: 'jzapaterdg', password: 'dg.jime.Z95452', name: 'Jimena Tamara Zapater Farfán', role: 'Servicio', store: 'Barranco', email: 'jzapaterfarfan@gmail.com', telefono: '993695452' },
          { username: 'vlobosdg', password: 'dg.vict.L46876', name: 'Victor Adolfo Lobos Contreras', role: 'Barista', store: 'Barranco', email: 'vincitore_21@hotmail.com', telefono: '910346876' },
          { username: 'molayadg', password: 'dg.math.O28974', name: 'Mathius Olaya Capcha', role: 'Barista', store: 'Barranco', email: 'mathiussaoc29@gmail.com', telefono: '973228974' }
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
              telefono: userToSeed.telefono || null,
              biometric_id: userToSeed.biometric_id || null
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

      // Ensure Christian Cueva and Jesus Ayma have correct biometric_id and role mapped in database
      let needsRefresh = false;
      const ccueva = (users || []).find(u => u.username === 'ccuevadg');
      const jayma = (users || []).find(u => u.username === 'jaymadg');

      if (ccueva && ccueva.role === 'Cocina') {
        console.log('[seeder] Updating Christian Cueva role to Administrador in Supabase...');
        await supabase
          .from('usuarios')
          .update({ role: 'Administrador' })
          .eq('username', 'ccuevadg');
        needsRefresh = true;
      }

      if (ccueva && (!ccueva.biometric_id || ccueva.biometric_id !== '71608726')) {
        console.log('[seeder] Updating Christian Cueva biometric_id to 71608726 in Supabase...');
        await supabase
          .from('usuarios')
          .update({ biometric_id: '71608726' })
          .eq('username', 'ccuevadg');
        needsRefresh = true;
      }

      if (jayma && (!jayma.biometric_id || jayma.biometric_id !== '60979426')) {
        console.log('[seeder] Updating Jesus Ayma biometric_id to 60979426 in Supabase...');
        await supabase
          .from('usuarios')
          .update({ biometric_id: '60979426' })
          .eq('username', 'jaymadg');
        needsRefresh = true;
      }

      const avasquez = (users || []).find(u => u.username === 'avasquezdg');
      if (avasquez && (!avasquez.biometric_id || avasquez.biometric_id !== '61096401')) {
        console.log('[seeder] Updating Alexander Vasquez biometric_id to 61096401 in Supabase...');
        await supabase
          .from('usuarios')
          .update({ biometric_id: '61096401' })
          .eq('username', 'avasquezdg');
        needsRefresh = true;
      }

      if (needsRefresh) {
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
