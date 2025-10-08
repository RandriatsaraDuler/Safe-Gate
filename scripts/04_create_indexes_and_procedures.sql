-- =====================================================
-- Index supplémentaires et procédures stockées
-- =====================================================

-- Index composites pour optimiser les requêtes fréquentes
CREATE INDEX idx_access_history_date_type ON access_history(DATE(created_at), access_type);
CREATE INDEX idx_access_history_result_confidence ON access_history(access_result, confidence_score);

-- Procédure pour nettoyer l'historique ancien
DELIMITER $$
CREATE PROCEDURE CleanOldHistory(IN days_to_keep INT)
BEGIN
    DECLARE deleted_count INT;
    
    DELETE FROM access_history 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL days_to_keep DAY);
    
    SET deleted_count = ROW_COUNT();
    
    INSERT INTO system_alerts (alert_type, severity, title, message)
    VALUES ('system', 'low', 'Nettoyage historique', 
           CONCAT('Suppression de ', deleted_count, ' entrées d\'historique anciennes'));
END$$

-- Procédure pour obtenir les statistiques quotidiennes
CREATE PROCEDURE GetDailyStats(IN target_date DATE)
BEGIN
    SELECT 
        access_type,
        access_result,
        COUNT(*) as total_attempts,
        AVG(confidence_score) as avg_confidence,
        MIN(confidence_score) as min_confidence,
        MAX(confidence_score) as max_confidence
    FROM access_history 
    WHERE DATE(created_at) = target_date
    GROUP BY access_type, access_result
    ORDER BY access_type, access_result;
END$$

-- Fonction pour calculer le taux de réussite
CREATE FUNCTION GetSuccessRate(start_date DATE, end_date DATE) 
RETURNS DECIMAL(5,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_attempts INT;
    DECLARE successful_attempts INT;
    DECLARE success_rate DECIMAL(5,2);
    
    SELECT COUNT(*) INTO total_attempts
    FROM access_history 
    WHERE DATE(created_at) BETWEEN start_date AND end_date;
    
    SELECT COUNT(*) INTO successful_attempts
    FROM access_history 
    WHERE DATE(created_at) BETWEEN start_date AND end_date
    AND access_result = 'granted';
    
    IF total_attempts > 0 THEN
        SET success_rate = (successful_attempts * 100.0) / total_attempts;
    ELSE
        SET success_rate = 0.0;
    END IF;
    
    RETURN success_rate;
END$$

DELIMITER ;
