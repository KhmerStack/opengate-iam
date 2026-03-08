-- Fix type mismatch: entity maps these as String/text but V1 created them as jsonb
ALTER TABLE realms
    ALTER COLUMN password_policy TYPE TEXT USING password_policy::TEXT,
    ALTER COLUMN smtp_settings    TYPE TEXT USING smtp_settings::TEXT;
