-- ==========================================
-- DON GUTO INTRANET - AMPLIACIÓN DE COLUMNAS
-- ==========================================

-- Ejecuta esta consulta en el SQL Editor de tu Supabase:
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS apellidos VARCHAR(255),
ADD COLUMN IF NOT EXISTS dni VARCHAR(20),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS telefono VARCHAR(20);
