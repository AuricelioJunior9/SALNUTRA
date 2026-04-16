-- SALNUTRA Seed Data
-- Senhas: admin123, operador123, usuario123 (bcrypt hash rounds=10)

-- Usuarios
INSERT INTO users (id, name, email, password_hash, role) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Carlos Admin',
    'admin@salnutra.com',
    '$2b$10$q.3UUIL4w4piK0oSORnX3.kCCJ7/cdCLI3wsCncUXMG9NXuNLc.T.',
    'admin'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Maria Operadora',
    'operador@salnutra.com',
    '$2b$10$gmIT0J/zygKayrCOrlpGEeqHI1RcDnh6/3jr.tFpCG38MvGEFWPN2',
    'operador'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Joao Visualizador',
    'usuario@salnutra.com',
    '$2b$10$OaNrB1gUfccbBgTmG1eQIOPvTdje4Kp41KTfZicQzx84fN7RdZSxu',
    'usuario'
  )
ON CONFLICT (email) DO NOTHING;

-- Variaveis de monitoramento (baseadas em DEFAULT_VARIABLES do frontend)
INSERT INTO variables (id, name, unit, min, max, warning_min, warning_max, icon, category) VALUES
  ('tds',        'TDS',               'ppm',   0,      300000, 50000,  280000, 'Droplets',    'salmoura'),
  ('ph',         'pH',                '',      0,      14,     6.5,    8.5,    'FlaskConical', 'salmoura'),
  ('temp_sal',   'Temperatura',       '°C',    0,      100,    15,     45,     'Thermometer',  'salmoura'),
  ('na',         'Na+',               'mg/L',  0,      150000, 30000,  120000, 'Atom',         'salmoura'),
  ('ca',         'Ca2+',              'mg/L',  0,      5000,   100,    4000,   'Circle',       'salmoura'),
  ('mg',         'Mg2+',              'mg/L',  0,      10000,  200,    8000,   'Hexagon',      'salmoura'),
  ('nivel',      'Nivel',             '%',     0,      100,    20,     95,     'Cylinder',     'salmoura'),
  ('vibracao',   'Vibracao',          'm/s²',  0,      20,     0,      10,     'Activity',     'motor'),
  ('corrente',   'Corrente Eletrica', 'A',     0,      100,    5,      80,     'Zap',          'motor'),
  ('temp_motor', 'Temperatura',       '°C',    0,      150,    20,     90,     'Thermometer',  'motor')
ON CONFLICT (id) DO UPDATE SET
  name        = EXCLUDED.name,
  unit        = EXCLUDED.unit,
  min         = EXCLUDED.min,
  max         = EXCLUDED.max,
  warning_min = EXCLUDED.warning_min,
  warning_max = EXCLUDED.warning_max,
  icon        = EXCLUDED.icon,
  category    = EXCLUDED.category;

-- Dispositivos (baseados em MOCK_DEVICES do frontend)
INSERT INTO devices (id, name, type, status, ip, last_seen) VALUES
  ('d1', 'CLP Principal',            'Controlador Logico Programavel', 'online',  '192.168.1.1',  NOW()),
  ('d2', 'Microcontrolador ESP32',   'Microcontrolador',               'online',  '192.168.1.10', NOW()),
  ('d3', 'Inversor de Frequencia CFW11', 'Inversor de Frequencia',     'online',  '192.168.1.20', NOW()),
  ('d4', 'Soft Starter SSW07',       'Soft Start',                     'offline', '192.168.1.21', NOW() - INTERVAL '2 hours')
ON CONFLICT (id) DO NOTHING;
