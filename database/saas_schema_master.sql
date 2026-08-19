-- ====================================================================
-- CULINARIA.NET.PE - MIGRACIÓN MAESTRA DE BASE DE DATOS SAAS MULTI-TENANT
-- Ejecutar este script en el Editor SQL de Supabase (SQL Editor)
-- ====================================================================

-- 1. TABLA DE ORGANIZACIONES / EMPRESAS (TENANTS)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    primary_color VARCHAR(50) DEFAULT '#4F46E5',
    secondary_color VARCHAR(50) DEFAULT '#10B981',
    status VARCHAR(50) DEFAULT 'Activa',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA DE SEDES / SUCURSALES (STORES)
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    timezone VARCHAR(100) DEFAULT 'America/Lima',
    attendance_mode VARCHAR(50) DEFAULT 'web_camera', -- 'web_camera' | 'zk_hardware'
    status VARCHAR(50) DEFAULT 'Activa',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA DE ROLES Y PERMISOS
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA DE USUARIOS / PERSONAL
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    store_name VARCHAR(255) DEFAULT 'Todas',
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255),
    dni VARCHAR(50),
    email VARCHAR(255),
    telefono VARCHAR(50),
    role VARCHAR(100) NOT NULL DEFAULT 'Servicio',
    biometric_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Activo',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA DE PLANTILLAS DE CHECKLISTS (CONFIGURABLE POR EMPRESA)
CREATE TABLE IF NOT EXISTS public.checklist_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    area VARCHAR(100) NOT NULL, -- 'BARRA', 'COCINA', 'SERVICIO', 'CAJA'
    tipo_turno VARCHAR(50) NOT NULL, -- 'APERTURA', 'RELEVO', 'CIERRE'
    descripcion TEXT NOT NULL,
    requiere_foto BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA DE CHECKLISTS COMPLETADOS DIARIAMENTE
CREATE TABLE IF NOT EXISTS public.checklists_completados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    store VARCHAR(255) NOT NULL,
    task_id VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    completado BOOLEAN DEFAULT false,
    evidencia TEXT,
    colaborador VARCHAR(255) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLA DE REGISTRO DE ASISTENCIAS (FOTO FACIAL & BIOMÉTRICO)
CREATE TABLE IF NOT EXISTS public.asistencia_biometrica (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    store VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    photo_url TEXT,
    delay_minutes INT DEFAULT 0,
    status VARCHAR(100) DEFAULT 'A tiempo',
    method VARCHAR(50) DEFAULT 'web_camera' -- 'web_camera' | 'zk_hardware'
);

-- 8. TABLA DE INCIDENCIAS
CREATE TABLE IF NOT EXISTS public.incidencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    store VARCHAR(255) NOT NULL,
    reporter VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'Media',
    status VARCHAR(50) DEFAULT 'Abierta',
    evidence_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ÍNDICES DE RENDIMIENTO PARA CONSULTAS RÁPIDAS MULTI-TENANT
CREATE INDEX IF NOT EXISTS idx_usuarios_org ON public.usuarios(organization_id);
CREATE INDEX IF NOT EXISTS idx_asistencia_org_date ON public.asistencia_biometrica(organization_id, date);
CREATE INDEX IF NOT EXISTS idx_checklists_org_date ON public.checklists_completados(organization_id, date, store);

-- 10. ORGANIZACIÓN INICIAL: DON GUTO
INSERT INTO public.organizations (name, slug, logo_url, primary_color, secondary_color)
VALUES ('Don Guto Cafetería', 'don-guto', '/favicon.svg', '#4F46E5', '#10B981')
ON CONFLICT (slug) DO NOTHING;
