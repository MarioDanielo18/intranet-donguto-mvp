import pg8000
import ssl

def main():
    host = "aws-0-sa-east-1.pooler.supabase.com"
    port = 6543
    user = "postgres.jchpxowbxxfrivrloqkg"
    password = "TCRXdgcuaVQkHu2r"
    database = "postgres"

    print("Connecting to Supabase PostgreSQL database (ignoring SSL verification)...")
    try:
        ssl_ctx = ssl.create_default_context()
        ssl_ctx.check_hostname = False
        ssl_ctx.verify_mode = ssl.CERT_NONE
        
        conn = pg8000.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database,
            ssl_context=ssl_ctx
        )
        print("Connected successfully!")
        
        cursor = conn.cursor()
        
        # Check tables in public schema
        cursor.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public';")
        tables = cursor.fetchall()
        print("Tables in public schema:", [t[0] for t in tables])

        # Check structure of checklists_completados if it exists
        cursor.execute("SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'checklists_completados');")
        exists = cursor.fetchone()[0]
        print("checklists_completados exists:", exists)
        
        if exists:
            cursor.execute("SELECT * FROM checklists_completados LIMIT 5;")
            rows = cursor.fetchall()
            print("Rows in checklists_completados:", len(rows))
            for r in rows:
                print(r)
        
        cursor.close()
        conn.close()

    except Exception as e:
        print("Error during SQL execution:", e)

if __name__ == "__main__":
    main()
