-- =============================================
-- RESOLVO - Crea Utente Admin
-- =============================================
-- Questo script crea l'utente amministratore
-- Email: admin@resolvo.it
-- Password: admin123 (hash bcrypt)
-- =============================================

USE recupero_crediti;

-- Elimina admin esistente se presente
DELETE FROM users WHERE email = 'admin@resolvo.it';

-- Crea utente admin
-- Password: admin123
-- Hash bcrypt generato con salt 10
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
  'admin@resolvo.it',
  '$2b$10$I8.40Yg8H.gRQIr3W8d6buJzzhkjtoGA5dtSg7nhfIt2eKbkLi5dq',
  'Admin',
  'Resolvo',
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

-- Verifica creazione admin
SELECT email, nome, cognome, ruolo
FROM users
WHERE email = 'admin@resolvo.it';
