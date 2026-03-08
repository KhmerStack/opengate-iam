#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE opengate_auth;
    CREATE DATABASE opengate_user;
    CREATE DATABASE opengate_realm;
    CREATE DATABASE opengate_rbac;
    CREATE DATABASE opengate_client;
    CREATE DATABASE opengate_notification;
EOSQL
