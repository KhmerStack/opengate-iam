CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE realms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    login_theme VARCHAR(100) DEFAULT 'default',
    token_lifespan_seconds INT NOT NULL DEFAULT 300,
    refresh_token_lifespan_seconds INT NOT NULL DEFAULT 2592000,
    mfa_required BOOLEAN NOT NULL DEFAULT false,
    password_policy JSONB,
    smtp_settings JSONB,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed master realm
INSERT INTO realms (name, display_name, enabled)
VALUES ('master', 'Master Realm', true);
