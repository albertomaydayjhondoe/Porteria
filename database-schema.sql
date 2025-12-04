-- ============================================
-- SCHEMA: Project Management Dashboard
-- Database: Supabase PostgreSQL  
-- ============================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS collaborators CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'in_development', 'completed', 'archived')),
    repository_url VARCHAR(500),
    tech_stack TEXT[], -- Array of technologies
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- ============================================
-- COLLABORATORS TABLE  
-- ============================================
CREATE TABLE collaborators (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) DEFAULT 'Developer',
    email VARCHAR(255),
    avatar_url VARCHAR(500),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_collaborators_project_id ON collaborators(project_id);
CREATE INDEX idx_collaborators_active ON collaborators(is_active);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Allow read access to projects" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON projects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for project creators" ON projects
    FOR UPDATE USING (auth.uid() = created_by);

-- Collaborators policies  
CREATE POLICY "Allow read access to collaborators" ON collaborators
    FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON collaborators
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- SAMPLE DATA FOR DEVELOPMENT
-- ============================================

-- Insert sample projects
INSERT INTO projects (name, description, status, tech_stack, repository_url) VALUES
('Paperboy Comics Platform', 'Daily comic strips platform with user management and content publishing', 'active', 
 ARRAY['React', 'Node.js', 'Supabase', 'Tailwind CSS'], 
 'https://github.com/albertomaydayjhondoe/Porteria'),
 
('Task Manager Pro', 'Advanced project management tool with real-time collaboration', 'in_development',
 ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
 'https://github.com/example/task-manager'),
 
('E-commerce Dashboard', 'Analytics and management dashboard for online stores', 'planning',
 ARRAY['Vue.js', 'Express.js', 'MongoDB', 'Chart.js'],
 'https://github.com/example/ecommerce-dashboard'),
 
('Social Media API', 'RESTful API for social media applications', 'active',
 ARRAY['FastAPI', 'Python', 'Redis', 'PostgreSQL'],
 'https://github.com/example/social-api');

-- Insert sample collaborators
INSERT INTO collaborators (project_id, name, role, email) VALUES
(1, 'Admin User', 'Project Manager', 'admin@example.com'),
(1, 'Sampayo', 'Full Stack Developer', 'sampayo@gmail.com'),  
(1, 'UI Designer', 'UI/UX Designer', 'designer@example.com'),
(2, 'Backend Dev', 'Backend Developer', 'backend@example.com'),
(2, 'Frontend Dev', 'Frontend Developer', 'frontend@example.com'),
(3, 'Product Owner', 'Product Manager', 'product@example.com'),
(4, 'API Specialist', 'API Developer', 'api@example.com');

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS FOR EASY QUERYING
-- ============================================

-- View for projects with collaborator count
CREATE VIEW projects_with_stats AS
SELECT 
    p.*,
    COALESCE(c.collaborator_count, 0) as collaborator_count
FROM projects p
LEFT JOIN (
    SELECT 
        project_id, 
        COUNT(*) as collaborator_count
    FROM collaborators 
    WHERE is_active = true
    GROUP BY project_id
) c ON p.id = c.project_id;

-- ============================================
-- GRANTS AND PERMISSIONS
-- ============================================

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Grant table permissions
GRANT SELECT ON projects, collaborators TO anon;
GRANT ALL ON projects, collaborators TO authenticated;

-- Grant view permissions
GRANT SELECT ON projects_with_stats TO anon, authenticated;