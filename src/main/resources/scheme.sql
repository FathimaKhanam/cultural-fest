
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('STUDENT', 'ADMIN', 'JUDGE')),
    mobile VARCHAR(15),
    college_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('SOLO', 'GROUP', 'TEAM')),
    max_participants INTEGER DEFAULT 1,
    max_registrations INTEGER DEFAULT 10,
    current_registrations INTEGER DEFAULT 0,
    registration_fee DECIMAL(10,2) DEFAULT 0.00,
    event_date DATE NOT NULL,
    event_start_time TIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    image TEXT,
    is_new BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'COMPLETED', 'CANCELLED')),
    winner_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'REGISTERED' CHECK (status IN ('REGISTERED', 'CANCELLED', 'COMPLETED', 'PARTICIPATED')),
    score DECIMAL(5,2),
    participant_name VARCHAR(255),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    email VARCHAR(255),
    mobile VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Judges Table
CREATE TABLE IF NOT EXISTS judges (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id BIGINT REFERENCES events(id) ON DELETE CASCADE,
    specialization VARCHAR(255),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Winners Table
CREATE TABLE IF NOT EXISTS winners (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    registration_id BIGINT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    position VARCHAR(50) NOT NULL CHECK (position IN ('FIRST', 'SECOND', 'THIRD')),
    final_score DECIMAL(5,2),
    prize VARCHAR(255),
    announced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('GENERAL', 'EVENT_UPDATE', 'WINNER_ANNOUNCEMENT', 'URGENT')),
    event_id BIGINT REFERENCES events(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default judges
INSERT INTO users (name, email, password, role) VALUES 
('Judge One', 'judge1@klu.com', 'Judge@1234', 'JUDGE'),
('Judge Two', 'judge2@klu.com', 'Judge@1234', 'JUDGE'),
('Judge Three', 'judge3@klu.com', 'Judge@1234', 'JUDGE'),
('Judge Four', 'judge4@klu.com', 'Judge@1234', 'JUDGE'),
('Judge Five', 'judge5@klu.com', 'Judge@1234', 'JUDGE')
ON CONFLICT (email) DO NOTHING;

-- Insert sample student
INSERT INTO users (name, email, password, role, mobile, college_id) VALUES 
('Student A', 'student@klu.com', 'Stud@1234', 'STUDENT', '9876543210', '2100030123')
ON CONFLICT (email) DO NOTHING;

-- Insert sample events
INSERT INTO events (name, description, category, type, max_participants, max_registrations, event_date, event_start_time, venue, is_new, status) VALUES
('Classical Dance', 'Showcase your traditional dance skills', 'Dance', 'SOLO', 1, 50, '2025-01-15', '10:00:00', 'Main Auditorium', TRUE, 'OPEN'),
('Western Vocals', 'Sing your favorite English songs', 'Music', 'SOLO', 1, 30, '2025-01-16', '14:00:00', 'Music Hall', TRUE, 'OPEN'),
('Group Dance', 'Team performance with synchronized moves', 'Dance', 'GROUP', 8, 20, '2025-01-17', '11:00:00', 'Main Auditorium', FALSE, 'OPEN'),
('Stand-up Comedy', 'Make the audience laugh with your humor', 'Comedy', 'SOLO', 1, 25, '2025-01-18', '16:00:00', 'Comedy Stage', TRUE, 'OPEN'),
('Drama Performance', 'Theatrical performance', 'Drama', 'GROUP', 10, 15, '2025-01-19', '15:00:00', 'Main Auditorium', FALSE, 'OPEN')
ON CONFLICT DO NOTHING;

-- Insert sample announcement
INSERT INTO announcements (title, content, type, is_active) VALUES
('Welcome to Cultural Fest 2025!', 'Get ready for an amazing celebration of talent and culture. Register for your favorite events now!', 'GENERAL', TRUE)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_winners_event ON winners(event_id);
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active);

---# Backup entire database to a dated file (super safe)
---pg_dump -U postgres -h localhost culturalfest > "culturalfest_backup_$(date +%Y-%m-%d_%H%M).sql"

---# Optional: also export as custom format (smaller + faster restore)
---pg_dump -U postgres -Fc culturalfest > "culturalfest_backup_$(date +%Y-%m-%d).dump"