-- SALNUTRA Database Schema

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'operador', 'usuario');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE variable_category AS ENUM ('salmoura', 'motor');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE device_status AS ENUM ('online', 'offline');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE reading_status AS ENUM ('normal', 'warning', 'critical');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Tabela de usuarios
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          user_role    NOT NULL DEFAULT 'usuario',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Tabela de variaveis monitoradas
CREATE TABLE IF NOT EXISTS variables (
  id          VARCHAR(50)       PRIMARY KEY,
  name        VARCHAR(255)      NOT NULL,
  unit        VARCHAR(50)       NOT NULL DEFAULT '',
  min         NUMERIC(15, 4)    NOT NULL,
  max         NUMERIC(15, 4)    NOT NULL,
  warning_min NUMERIC(15, 4)    NOT NULL,
  warning_max NUMERIC(15, 4)    NOT NULL,
  icon        VARCHAR(100)      NOT NULL DEFAULT '',
  category    variable_category NOT NULL
);

-- Tabela de dispositivos
CREATE TABLE IF NOT EXISTS devices (
  id        VARCHAR(50)   PRIMARY KEY,
  name      VARCHAR(255)  NOT NULL,
  type      VARCHAR(255)  NOT NULL,
  status    device_status NOT NULL DEFAULT 'offline',
  ip        VARCHAR(50)   NOT NULL,
  last_seen TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Tabela de leituras dos sensores
CREATE TABLE IF NOT EXISTS readings (
  id          SERIAL        PRIMARY KEY,
  variable_id VARCHAR(50)   NOT NULL REFERENCES variables(id) ON DELETE CASCADE,
  value       NUMERIC(15, 4) NOT NULL,
  status      reading_status NOT NULL,
  timestamp   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Indice para queries de historico (variable_id + timestamp mais recente)
CREATE INDEX IF NOT EXISTS idx_readings_variable_timestamp
  ON readings (variable_id, timestamp DESC);

-- Indice para limpeza automatica de leituras antigas
CREATE INDEX IF NOT EXISTS idx_readings_timestamp
  ON readings (timestamp DESC);
