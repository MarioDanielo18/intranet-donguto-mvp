-- CULINARIA.NET.PE - MIGRACION MAESTRA DE BASE DE DATOS SAAS MULTI-TENANT

-- 1. TABLA DE ORGANIZACIONES
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

-- 2. TABLA DE SEDES
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    timezone VARCHAR(100) DEFAULT 'America/Lima',
    attendance_mode VARCHAR(50) DEFAULT 'web_camera',
    status VARCHAR(50) DEFAULT 'Activa',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA DE ROLES
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA DE USUARIOS
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS store_name VARCHAR(255) DEFAULT 'Todas';
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS apellidos VARCHAR(255);
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS dni VARCHAR(50);
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS telefono VARCHAR(50);
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS role VARCHAR(100) DEFAULT 'Servicio';
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS biometric_id VARCHAR(100);
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Activo';

-- 5. TABLA DE PLANTILLAS DE CHECKLISTS
CREATE TABLE IF NOT EXISTS public.checklist_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    area VARCHAR(100) NOT NULL,
    tipo_turno VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    requiere_foto BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA DE CHECKLISTS COMPLETADOS
CREATE TABLE IF NOT EXISTS public.checklists_completados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store VARCHAR(255) NOT NULL,
    task_id VARCHAR(100) NOT NULL,
    completado BOOLEAN DEFAULT false,
    evidencia TEXT,
    colaborador VARCHAR(255) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.checklists_completados ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.checklists_completados ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE;

-- 7. TABLA DE ASISTENCIAS BIOMETRICAS
CREATE TABLE IF NOT EXISTS public.asistencia_biometrica (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    store VARCHAR(255) NOT NULL,
    time VARCHAR(50) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.asistencia_biometrica ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.asistencia_biometrica ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.asistencia_biometrica ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.asistencia_biometrica ADD COLUMN IF NOT EXISTS delay_minutes INT DEFAULT 0;
ALTER TABLE public.asistencia_biometrica ADD COLUMN IF NOT EXISTS status VARCHAR(100) DEFAULT 'A tiempo';
ALTER TABLE public.asistencia_biometrica ADD COLUMN IF NOT EXISTS method VARCHAR(50) DEFAULT 'web_camera';

-- 8. TABLA DE INCIDENCIAS
CREATE TABLE IF NOT EXISTS public.incidencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store VARCHAR(255) NOT NULL,
    reporter VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'Media',
    status VARCHAR(50) DEFAULT 'Abierta',
    evidence_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.incidencias ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 9. INDICES SEGUROS
CREATE INDEX IF NOT EXISTS idx_usuarios_org ON public.usuarios(organization_id);

-- 10. INSERTAR ORGANIZACION INICIAL
INSERT INTO public.organizations (name, slug, logo_url, primary_color, secondary_color)
VALUES ('Don Guto Cafetería', 'don-guto', '/favicon.svg', '#4F46E5', '#10B981')
ON CONFLICT (slug) DO NOTHING;
