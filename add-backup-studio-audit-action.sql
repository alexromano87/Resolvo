-- Aggiorna enum action per includere BACKUP_STUDIO
ALTER TABLE audit_logs
  MODIFY COLUMN action ENUM(
    'LOGIN',
    'LOGOUT',
    'LOGIN_FAILED',
    'CREATE',
    'UPDATE',
    'DELETE',
    'VIEW',
    'TOGGLE_ACTIVE',
    'RESET_PASSWORD',
    'ASSIGN_STUDIO',
    'UPLOAD_FILE',
    'DOWNLOAD_FILE',
    'DELETE_FILE',
    'EXPORT_DATA',
    'BACKUP_STUDIO',
    'IMPORT_DATA'
  ) NOT NULL;
