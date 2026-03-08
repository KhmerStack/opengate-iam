CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    realm_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    composite BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (realm_name, name)
);

CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    realm_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES groups(id),
    path VARCHAR(1000)
);

CREATE TABLE user_role_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    realm_name VARCHAR(255) NOT NULL,
    UNIQUE (user_id, role_id)
);

CREATE TABLE group_role_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE (group_id, role_id)
);

CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    realm_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    resource VARCHAR(255),
    action VARCHAR(255),
    effect VARCHAR(10) NOT NULL DEFAULT 'PERMIT',
    conditions JSONB
);
