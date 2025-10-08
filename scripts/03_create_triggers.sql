-- =====================================================
-- Triggers pour automatiser certaines actions
-- =====================================================

-- Trigger pour mettre à jour last_access des utilisateurs
DELIMITER $$
CREATE TRIGGER update_user_last_access
    AFTER INSERT ON access_history
    FOR EACH ROW
BEGIN
    IF NEW.user_id IS NOT NULL AND NEW.access_result = 'granted' THEN
        UPDATE authorized_users 
        SET last_access = NEW.created_at 
        WHERE id = NEW.user_id;
    END IF;
END$$

-- Trigger pour mettre à jour last_access des véhicules
CREATE TRIGGER update_vehicle_last_access
    AFTER INSERT ON access_history
    FOR EACH ROW
BEGIN
    IF NEW.vehicle_id IS NOT NULL AND NEW.access_result = 'granted' THEN
        UPDATE authorized_vehicles 
        SET last_access = NEW.created_at 
        WHERE id = NEW.vehicle_id;
    END IF;
END$$

-- Trigger pour créer une alerte en cas d'accès refusé répétés
CREATE TRIGGER security_alert_on_denied_access
    AFTER INSERT ON access_history
    FOR EACH ROW
BEGIN
    DECLARE denied_count INT;
    
    IF NEW.access_result = 'denied' THEN
        -- Compter les accès refusés dans les 10 dernières minutes
        SELECT COUNT(*) INTO denied_count
        FROM access_history 
        WHERE access_result = 'denied' 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 10 MINUTE);
        
        -- Si plus de 3 accès refusés en 10 minutes, créer une alerte
        IF denied_count >= 3 THEN
            INSERT INTO system_alerts (alert_type, severity, title, message)
            VALUES ('security', 'high', 'Tentatives d\'accès suspectes', 
                   CONCAT('Détection de ', denied_count, ' tentatives d\'accès refusées en 10 minutes'));
        END IF;
    END IF;
END$$

DELIMITER ;
