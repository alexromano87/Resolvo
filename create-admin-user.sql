-- =============================================
-- RESOLVO - Crea Utente Admin
-- =============================================
-- Questo script crea l'utente amministratore
-- Email: admin@studio.it
-- Password: admin123 (hash bcrypt)
-- =============================================

USE recupero_crediti;

-- Elimina admin esistente se presente
DELETE FROM users WHERE email = 'admin@studio.it';

-- Crea utente admin
-- Password: admin123
-- Hash bcrypt: $2b$10$K8P5YqE.5Z.5Z5Z5Z5Z5ZuJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5
-- NOTA: Questo hash è un placeholder. Al primo avvio usa il comando:
--       docker-compose exec backend npm run seed:admin
--       per creare l'admin con hash corretto
INSERT INTO users (
  id,
  email,
  password,
  nome,
  cognome,
  telefono,
  ruolo,
  clienteId,
  studioId,
  attivo,
  tokenVersion,
  twoFactorEnabled,
  failedLoginAttempts,
  settings,
  createdAt,
  updatedAt
) VALUES (
  '31a24c32-4063-4636-99d3-f0e162a1265c',
  'admin@studio.it',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Admin',
  'Studio',
  NULL,
  'admin',
  NULL,
  NULL,
  1,
  0,
  0,
  0,
  NULL,
  NOW(),
  NOW()
);

SELECT
  'Admin user created successfully!' AS status,
  email,
  nome,
  cognome,
  ruolo
FROM users
WHERE email = 'admin@studio.it';

SELECT '---' AS separator;
SELECT 'Login credentials:' AS info;
SELECT 'Email: admin@studio.it' AS email;
SELECT 'Password: admin123' AS password;
SELECT 'IMPORTANT: Change this password after first login!' AS warning;
