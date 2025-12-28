import type { Response } from 'express';
import { AuditLogService } from './audit-log.service';
import type { AuditAction, AuditEntity } from './audit-log.entity';
export declare class AuditLogController {
    private readonly auditLogService;
    constructor(auditLogService: AuditLogService);
    getLogs(userId?: string, studioId?: string, entityType?: AuditEntity, action?: AuditAction, startDate?: string, endDate?: string, success?: string, search?: string, page?: string, limit?: string): Promise<{
        logs: import("./audit-log.entity").AuditLog[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getStats(userId?: string, studioId?: string, startDate?: string, endDate?: string): Promise<{
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
    exportLogs(res: Response, userId?: string, studioId?: string, entityType?: AuditEntity, action?: AuditAction, startDate?: string, endDate?: string, success?: string, search?: string): Promise<void>;
    cleanupOldLogs(body: {
        daysToKeep?: number;
    }): Promise<{
        message: string;
        deletedCount: number;
        daysToKeep: number;
    }>;
}
