-- ==========================================
-- DON GUTO INTRANET - TABLA DE CHECKLISTS DIARIOS
-- ==========================================

-- Ejecuta esta consulta en el SQL Editor de tu Supabase para habilitar la persistencia de fotos y checklists diarios:

CREATE TABLE IF NOT EXISTS checklists_completados (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(100) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    completado BOOLEAN NOT NULL DEFAULT TRUE,
    evidencia TEXT NULL, -- Almacena la imagen en base64 de la foto tomada
    colaborador VARCHAR(100) NOT NULL,
    store VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (task_id, date, store)
);

-- Habilitar índices para mejorar el rendimiento de las búsquedas históricas por fecha y tienda
CREATE INDEX IF NOT EXISTS idx_checklists_date_store ON checklists_completados(date DESC, store);
