-- Script SQL para inicializar la tabla de comics en Supabase
-- Ejecutar en el SQL Editor de Supabase

-- Crear tabla comics
CREATE TABLE IF NOT EXISTS comics (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    tags TEXT[] DEFAULT '{}',
    image VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar datos de ejemplo (tiras actuales)
INSERT INTO comics (title, date, tags, image, description) VALUES
('Miércoles de Reflexión', '2025-12-04', ARRAY['hoy', 'reflexión', 'miércoles'], '/Porteria/assets/tiras/2025-12-04-miercoles-reflexion.svg', 'Una tira sobre la reflexión que llega a mitad de semana'),
('El Merge Perfecto', '2025-12-03', ARRAY['tech', 'programming', 'humor'], '/Porteria/assets/tiras/2025-12-03-merge-perfecto.svg', 'Cuando todo sale bien en el desarrollo de software'),
('Luces de Diciembre', '2025-12-02', ARRAY['navidad', 'vida', 'diciembre'], '/Porteria/assets/tiras/2025-12-02-luces-diciembre.svg', 'El ambiente navideño que se siente en el aire'),
('Primer Día del Mes', '2025-12-01', ARRAY['nuevo-mes', 'esperanza', 'diciembre'], '/Porteria/assets/tiras/2025-12-01-primer-dia.svg', 'Nuevas oportunidades en un nuevo mes');

-- Habilitar Row Level Security (RLS)
ALTER TABLE comics ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura pública
CREATE POLICY "Allow public read access" ON comics
FOR SELECT TO public
USING (true);

-- Crear política para permitir escritura autenticada (opcional)
CREATE POLICY "Allow authenticated insert" ON comics
FOR INSERT TO authenticated
WITH CHECK (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_comics_updated_at 
    BEFORE UPDATE ON comics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verificar que los datos se insertaron correctamente
SELECT * FROM comics ORDER BY date DESC;