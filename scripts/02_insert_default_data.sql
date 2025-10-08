-- =====================================================
-- Données par défaut pour le système
-- =====================================================

-- Insertion des paramètres système par défaut
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('confidence_threshold', '75.0', 'number', 'Seuil de confiance minimum pour autoriser l\'accès (%)'),
('gate_close_delay', '5', 'number', 'Délai de fermeture automatique de la barrière (secondes)'),
('max_daily_attempts', '10', 'number', 'Nombre maximum de tentatives par utilisateur par jour'),
('enable_logging', 'true', 'boolean', 'Activer la journalisation des événements'),
('enable_notifications', 'true', 'boolean', 'Activer les notifications système'),
('maintenance_mode', 'false', 'boolean', 'Mode maintenance du système'),
('facial_recognition_enabled', 'true', 'boolean', 'Activer la reconnaissance faciale'),
('license_plate_recognition_enabled', 'true', 'boolean', 'Activer la reconnaissance de plaques'),
('backup_frequency', '24', 'number', 'Fréquence de sauvegarde automatique (heures)'),
('session_timeout', '30', 'number', 'Délai d\'expiration des sessions (minutes)');

-- Insertion d'utilisateurs autorisés par défaut
INSERT INTO authorized_users (name, email, phone, department, access_level, photo_url) VALUES
('Jean Dupont', 'jean.dupont@company.com', '+33123456789', 'Direction', 'admin', '/professional-man.jpg'),
('Marie Martin', 'marie.martin@company.com', '+33123456790', 'RH', 'admin', '/professional-woman-diverse.png'),
('Pierre Durand', 'pierre.durand@company.com', '+33123456791', 'IT', 'basic', NULL),
('Sophie Leblanc', 'sophie.leblanc@company.com', '+33123456792', 'Comptabilité', 'basic', NULL),
('Thomas Moreau', 'thomas.moreau@company.com', '+33123456793', 'Commercial', 'basic', NULL);

-- Insertion de véhicules autorisés par défaut
INSERT INTO authorized_vehicles (license_plate, owner_name, vehicle_model, vehicle_color, vehicle_type, photo_url) VALUES
('AB-123-CD', 'Jean Dupont', 'BMW Série 3', 'Noir', 'car', '/car-license-plate.jpg'),
('EF-456-GH', 'Marie Martin', 'Audi A4', 'Blanc', 'car', NULL),
('IJ-789-KL', 'Pierre Durand', 'Volkswagen Golf', 'Gris', 'car', NULL),
('MN-012-OP', 'Sophie Leblanc', 'Renault Clio', 'Rouge', 'car', NULL),
('QR-345-ST', 'Société Transport', 'Mercedes Sprinter', 'Blanc', 'van', NULL);

-- Insertion d'historique d'accès d'exemple
INSERT INTO access_history (access_type, user_id, vehicle_id, access_result, confidence_score, detection_method, access_point, notes) VALUES
('person', 1, NULL, 'granted', 95.50, 'facial_recognition', 'main_gate', 'Reconnaissance faciale réussie'),
('vehicle', NULL, 1, 'granted', 88.20, 'license_plate', 'main_gate', 'Plaque d\'immatriculation reconnue'),
('person', 2, NULL, 'granted', 92.30, 'facial_recognition', 'main_gate', 'Accès autorisé'),
('person', NULL, NULL, 'denied', 45.10, 'facial_recognition', 'main_gate', 'Personne non autorisée détectée'),
('vehicle', NULL, NULL, 'denied', 32.80, 'license_plate', 'main_gate', 'Véhicule non autorisé'),
('person', 3, NULL, 'granted', 89.70, 'facial_recognition', 'main_gate', 'Accès employé IT'),
('vehicle', NULL, 2, 'granted', 91.40, 'license_plate', 'main_gate', 'Véhicule Marie Martin');

-- Insertion d'alertes système d'exemple
INSERT INTO system_alerts (alert_type, severity, title, message) VALUES
('security', 'medium', 'Tentative d\'accès non autorisée', 'Une personne non reconnue a tenté d\'accéder au site à 14:32'),
('system', 'low', 'Mise à jour disponible', 'Une nouvelle version du logiciel de reconnaissance est disponible'),
('maintenance', 'high', 'Maintenance programmée', 'Maintenance du système prévue demain de 02:00 à 04:00');
