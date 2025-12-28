import { Repository } from 'typeorm';
import { AuditLog, AuditAction, AuditEntity } from './audit-log.entity';
export interface CreateAuditLogDto {
    userId?: string | null;
    userEmail?: string | null;
    userRole?: string | null;
    action: AuditAction;
    entityType: AuditEntity;
    entityId?: string | null;
    entityName?: string | null;
    description?: string | null;
    metadata?: Record<string, any> | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    studioId?: string | null;
    success?: boolean;
    errorMessage?: string | null;
}
export interface AuditLogFilters {
    userId?: string;
    studioId?: string;
    entityType?: AuditEntity;
    action?: AuditAction;
    startDate?: Date;
    endDate?: Date;
    success?: boolean;
    search?: string;
}
export declare class AuditLogService {
    private auditLogRepository;
    constructor(auditLogRepository: Repository<AuditLog>);
    log(data: CreateAuditLogDto): Promise<AuditLog>;
    findAll(filters?: AuditLogFilters, page?: number, limit?: number): Promise<{
        logs: AuditLog[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getStats(filters?: AuditLogFilters): Promise<{
        total: number;
        successCount: number;
        failureCount: number;
        actionStats: {
            action: any;
            count: number;
        }[];
        entityStats: {
            entityType: any;
            count: number;
        }[];
    }>;
    cleanOldLogs(daysToKeep?: number): Promise<number>;
    exportToCSV(filters?: AuditLogFilters): Promise<string>;
}
