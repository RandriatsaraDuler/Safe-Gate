-- =====================================================
-- MCD - Système de Porte Automatique Intelligente
-- =====================================================

-- Table des utilisateurs autorisés (personnes)
CREATE TABLE authorized_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    photo_url VARCHAR(500),
    face_encoding TEXT, -- Encodage biométrique pour reconnaissance faciale
    department VARCHAR(100),
    access_level ENUM('basic', 'admin', 'visitor') DEFAULT 'basic',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_access TIMESTAMP NULL,
    
    INDEX idx_name (name),
    INDEX idx_email (email),
    INDEX idx_active (is_active),
    INDEX idx_access_level (access_level)
);

-- Table des véhicules autorisés
CREATE TABLE authorized_vehicles (
    id SERIAL PRIMARY KEY,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    owner_name VARCHAR(100) NOT NULL,
    vehicle_model VARCHAR(100),
    vehicle_color VARCHAR(50),
    vehicle_type ENUM('car', 'truck', 'motorcycle', 'van') DEFAULT 'car',
    photo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_access TIMESTAMP NULL,
    
    INDEX idx_license_plate (license_plate),
    INDEX idx_owner_name (owner_name),
    INDEX idx_active (is_active),
    INDEX idx_vehicle_type (vehicle_type)
);

-- Table de l'historique des accès
CREATE TABLE access_history (
    id SERIAL PRIMARY KEY,
    access_type ENUM('person', 'vehicle') NOT NULL,
    user_id INT NULL,
    vehicle_id INT NULL,
    access_result ENUM('granted', 'denied') NOT NULL,
    confidence_score DECIMAL(5,2), -- Score de confiance de l'IA (0.00 à 100.00)
    detection_method ENUM('facial_recognition', 'license_plate', 'manual') NOT NULL,
    image_url VARCHAR(500), -- URL de l'image capturée
    access_point VARCHAR(100) DEFAULT 'main_gate',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES authorized_users(id) ON DELETE SET NULL,
    FOREIGN KEY (vehicle_id) REFERENCES authorized_vehicles(id) ON DELETE SET NULL,
    
    INDEX idx_access_type (access_type),
    INDEX idx_access_result (access_result),
    INDEX idx_created_at (created_at),
    INDEX idx_user_id (user_id),
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_confidence_score (confidence_score),
    
    -- Contrainte : soit user_id soit vehicle_id doit être renseigné pour les accès autorisés
    CONSTRAINT chk_access_reference CHECK (
        (access_result = 'denied') OR 
        (access_result = 'granted' AND (user_id IS NOT NULL OR vehicle_id IS NOT NULL))
    )
);

-- Table des paramètres système
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_editable BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key)
);

-- Table des sessions de reconnaissance (pour traçabilité)
CREATE TABLE recognition_sessions (
    id SERIAL PRIMARY KEY,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    detection_type ENUM('person', 'vehicle') NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    uploaded_image_url VARCHAR(500),
    processed_image_url VARCHAR(500),
    processing_start_time TIMESTAMP,
    processing_end_time TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_session_token (session_token),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Table des alertes et notifications
CREATE TABLE system_alerts (
    id SERIAL PRIMARY KEY,
    alert_type ENUM('security', 'system', 'maintenance') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    
    INDEX idx_alert_type (alert_type),
    INDEX idx_severity (severity),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- Vue pour les statistiques d'accès
CREATE VIEW access_statistics AS
SELECT 
    DATE(created_at) as access_date,
    access_type,
    access_result,
    COUNT(*) as total_attempts,
    AVG(confidence_score) as avg_confidence
FROM access_history 
GROUP BY DATE(created_at), access_type, access_result
ORDER BY access_date DESC;

-- Vue pour les utilisateurs actifs avec leur dernier accès
CREATE VIEW active_users_summary AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.department,
    u.access_level,
    u.last_access,
    COUNT(ah.id) as total_accesses,
    MAX(ah.created_at) as most_recent_access
FROM authorized_users u
LEFT JOIN access_history ah ON u.id = ah.user_id
WHERE u.is_active = true
GROUP BY u.id, u.name, u.email, u.department, u.access_level, u.last_access
ORDER BY most_recent_access DESC;

-- Vue pour les véhicules actifs avec leur dernier accès
CREATE VIEW active_vehicles_summary AS
SELECT 
    v.id,
    v.license_plate,
    v.owner_name,
    v.vehicle_model,
    v.vehicle_type,
    v.last_access,
    COUNT(ah.id) as total_accesses,
    MAX(ah.created_at) as most_recent_access
FROM authorized_vehicles v
LEFT JOIN access_history ah ON v.id = ah.vehicle_id
WHERE v.is_active = true
GROUP BY v.id, v.license_plate, v.owner_name, v.vehicle_model, v.vehicle_type, v.last_access
ORDER BY most_recent_access DESC;
