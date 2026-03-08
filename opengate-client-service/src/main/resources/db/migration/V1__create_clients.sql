CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE oauth_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    realm_name VARCHAR(255) NOT NULL,
    client_id VARCHAR(255) UNIQUE NOT NULL,
    client_secret_hash TEXT,
    name VARCHAR(255),
    description TEXT,
    public_client BOOLEAN NOT NULL DEFAULT false,
    pkce_required BOOLEAN NOT NULL DEFAULT false,
    enabled BOOLEAN NOT NULL DEFAULT true,
    redirect_uris TEXT[],
    web_origins TEXT[],
    grant_types TEXT[],
    scopes TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clients_realm ON oauth_clients(realm_name);
