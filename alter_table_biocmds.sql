-- =======================================================
-- DON GUTO INTRANET - COLA DE COMANDOS BIOMÉTRICOS (ADMS)
-- =======================================================

-- Ejecuta esta consulta en el SQL Editor de tu Supabase:
CREATE TABLE IF NOT EXISTS comandos_biometricos (
    id SERIAL PRIMARY KEY,
    device_sn VARCHAR(100) NOT NULL,
    command_id VARCHAR(100) NOT NULL UNIQUE,
    command_text VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, SENT, COMPLETED, FAILED
    finger_id INT NULL,
    dni VARCHAR(20) NULL,
    response_text TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
