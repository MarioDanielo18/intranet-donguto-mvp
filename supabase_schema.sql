-- ==========================================
-- DON GUTO INTRANET - CONFIGURACIÓN SUPABASE
-- ==========================================

-- 1. CREACIÓN DE LA TABLA DE USUARIOS
-- Almacena las credenciales y perfiles de los empleados de Don Guto.
CREATE TABLE IF NOT EXISTS usuarios (
    username VARCHAR(100) PRIMARY KEY,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    store VARCHAR(100) NOT NULL,
    biometric_id VARCHAR(50) UNIQUE NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CREACIÓN DE LA TABLA DE ASISTENCIA BIOMÉTRICA (MARCACIONES)
-- Almacena las marcas recolectadas en tiempo real directamente desde el ZKTeco M1.
CREATE TABLE IF NOT EXISTS asistencia_biometrica (
    punch_id VARCHAR(100) PRIMARY KEY,
    biometric_id VARCHAR(50) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    device_id VARCHAR(100) NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar índices para mejorar el rendimiento de las consultas de marcaciones
CREATE INDEX IF NOT EXISTS idx_asistencia_timestamp ON asistencia_biometrica(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_asistencia_biometric_id ON asistencia_biometrica(biometric_id);

-- 3. INSERCIÓN DE COLABORADORES INICIALES (SEMILLA)
-- Creamos los perfiles para barista, cocina, servicio, administrador, supervisor, gerente general y técnico.
INSERT INTO usuarios (username, password, name, role, store, biometric_id) VALUES
-- Local Barranco
('qlopezdg', 'baristadg', 'Mateo Quispe López', 'Barista', 'Barranco', NULL),
('mcastrodg', 'baristadg', 'Carlos Mendoza Castro', 'Barista', 'Barranco', NULL),
('aruizdg', 'cocinadg', 'Gabriela Alva Ruiz', 'Cocina', 'Barranco', NULL),
('rguerradg', 'cocinadg', 'Elena Rojas Guerra', 'Cocina', 'Barranco', NULL),
('fpinedodg', 'serviciodg', 'Rodrigo Flores Pinedo', 'Servicio', 'Barranco', NULL),
('dortizdg', 'serviciodg', 'Lucía Díaz Ortiz', 'Servicio', 'Barranco', NULL),

-- Local Miraflores
('mortizdg', 'baristadg', 'Carlos Miraflores Ortiz', 'Barista', 'Miraflores', NULL),
('tsalasdg', 'cocinadg', 'Laura Torres Salas', 'Cocina', 'Miraflores', NULL),
('sramosdg', 'serviciodg', 'Andres Silva Ramos', 'Servicio', 'Miraflores', NULL),

-- Administración, Supervisión y Gerencia
('vrojasdg', 'admindg', 'Diana Valdivia Rojas', 'Administrador', 'Barranco', NULL),
('sgomezdg', 'supervisordg', 'Pedro Supervisor Gómez', 'Supervisor', 'Todas', NULL),
('dongutodg', 'gerentedg', 'Don Guto', 'Gerente', 'Todas', NULL),
('mquispedg', 'gerentedg', 'Mario Quispe', 'Gerente', 'Todas', '898681'), -- Enlazado con su huella real de ZKBio

-- Perfil Técnico (Administrador del Intranet)
('tecnicodg', 'tecnicodg', 'Técnico de Sistemas', 'Técnico', 'Todas', NULL)

ON CONFLICT (username) DO UPDATE 
SET 
  password = EXCLUDED.password,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  store = EXCLUDED.store,
  biometric_id = COALESCE(usuarios.biometric_id, EXCLUDED.biometric_id);
