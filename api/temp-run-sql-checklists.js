import pg from 'pg';

export default async function handler(req, res) {
  const hosts = [
    "aws-0-sa-east-1.pooler.supabase.com",
    "aws-1-sa-east-1.pooler.supabase.com"
  ];
  
  let success = false;
  let lastError = null;
  let activeHost = "";
  let tables = [];

  for (const host of hosts) {
    const connectionString = `postgres://postgres.jchpxowbxxfrivrloqkg:TCRXdgcuaVQkHu2r@${host}:6543/postgres`;
    const client = new pg.Client({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      console.log(`Trying to connect to ${host}...`);
      await client.connect();
      activeHost = host;
      
      // 1. CREATE checklists_completados TABLE
      const createTableSql = `
        CREATE TABLE IF NOT EXISTS checklists_completados (
            id SERIAL PRIMARY KEY,
            task_id VARCHAR(100) NOT NULL,
            date DATE NOT NULL DEFAULT CURRENT_DATE,
            completado BOOLEAN NOT NULL DEFAULT TRUE,
            evidencia TEXT NULL,
            colaborador VARCHAR(100) NOT NULL,
            store VARCHAR(100) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE (task_id, date, store)
        );
      `;
      await client.query(createTableSql);

      // 2. CREATE INDEX
      await client.query("CREATE INDEX IF NOT EXISTS idx_checklists_date_store ON checklists_completados(date DESC, store);");

      // Verify tables
      const result = await client.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public';");
      tables = result.rows.map(r => r.tablename);

      await client.end();
      success = true;
      break;

    } catch (err) {
      console.error(`Failed connecting to ${host}:`, err.message);
      lastError = err.message;
      try {
        await client.end();
      } catch (e) {}
    }
  }

  if (success) {
    return res.status(200).json({
      status: 'success',
      message: `Table checklists_completados and indexes created successfully on host ${activeHost}!`,
      tables
    });
  } else {
    return res.status(500).json({
      status: 'error',
      message: `Failed to connect/execute on all pooler hosts. Last error: ${lastError}`
    });
  }
}
