import { User } from '../users/user.entity';
export type AuditAction = 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'TOGGLE_ACTIVE' | 'RESET_PASSWORD' | 'ASSIGN_STUDIO' | 'UPLOAD_FILE' | 'DOWNLOAD_FILE' | 'DELETE_FILE' | 'EXPORT_DATA' | 'BACKUP_STUDIO' | 'IMPORT_DATA';
export type AuditEntity = 'USER' | 'STUDIO' | 'CLIENTE' | 'DEBITORE' | 'PRATICA' | 'AVVOCATO' | 'MOVIMENTO_FINANZIARIO' | 'ALERT' | 'TICKET' | 'DOCUMENTO' | 'CARTELLA' | 'SYSTEM';
export declare class AuditLog {
    id: string;
    createdAt: Date;
    userId: string | null;
    user: User | null;
    userEmail: string | null;
    userRole: string | null;
    action: AuditAction;
    entityType: AuditEntity;
    entityId: string | null;
    entityName: string | null;
    description: string | null;
    metadata: Record<string, any> | null;
    ipAddress: string | null;
    userAgent: string | null;
    studioId: string | null;
    success: boolean;
    errorMessage: string | null;
}
