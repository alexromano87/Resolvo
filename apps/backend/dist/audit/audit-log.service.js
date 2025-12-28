"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_log_entity_1 = require("./audit-log.entity");
let AuditLogService = class AuditLogService {
    auditLogRepository;
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async log(data) {
        const auditLog = this.auditLogRepository.create({
            ...data,
            success: data.success !== undefined ? data.success : true,
        });
        return this.auditLogRepository.save(auditLog);
    }
    async findAll(filters, page = 1, limit = 100) {
        const query = this.auditLogRepository
            .createQueryBuilder('log')
            .leftJoinAndSelect('log.user', 'user')
            .orderBy('log.createdAt', 'DESC');
        if (filters) {
            if (filters.userId) {
                query.andWhere('log.userId = :userId', { userId: filters.userId });
            }
            if (filters.studioId !== undefined) {
                query.andWhere('log.studioId = :studioId', { studioId: filters.studioId });
            }
            if (filters.entityType) {
                query.andWhere('log.entityType = :entityType', { entityType: filters.entityType });
            }
            if (filters.action) {
                query.andWhere('log.action = :action', { action: filters.action });
            }
            if (filters.success !== undefined) {
                query.andWhere('log.success = :success', { success: filters.success });
            }
            if (filters.startDate && filters.endDate) {
                query.andWhere('log.createdAt BETWEEN :startDate AND :endDate', {
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                });
            }
            else if (filters.startDate) {
                query.andWhere('log.createdAt >= :startDate', { startDate: filters.startDate });
            }
            else if (filters.endDate) {
                query.andWhere('log.createdAt <= :endDate', { endDate: filters.endDate });
            }
            if (filters.search) {
                query.andWhere('(log.description LIKE :search OR log.entityName LIKE :search OR log.userEmail LIKE :search)', { search: `%${filters.search}%` });
            }
        }
        const total = await query.getCount();
        const logs = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        return {
            logs,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getStats(filters) {
        const query = this.auditLogRepository.createQueryBuilder('log');
        if (filters) {
            if (filters.userId) {
                query.andWhere('log.userId = :userId', { userId: filters.userId });
            }
            if (filters.studioId !== undefined) {
                query.andWhere('log.studioId = :studioId', { studioId: filters.studioId });
            }
            if (filters.startDate && filters.endDate) {
                query.andWhere('log.createdAt BETWEEN :startDate AND :endDate', {
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                });
            }
            else if (filters.startDate) {
                query.andWhere('log.createdAt >= :startDate', { startDate: filters.startDate });
            }
            else if (filters.endDate) {
                query.andWhere('log.createdAt <= :endDate', { endDate: filters.endDate });
            }
        }
        const [total, successCount, failureCount,] = await Promise.all([
            query.getCount(),
            query.clone().andWhere('log.success = :success', { success: true }).getCount(),
            query.clone().andWhere('log.success = :success', { success: false }).getCount(),
        ]);
        const actionStats = await this.auditLogRepository
            .createQueryBuilder('log')
            .select('log.action', 'action')
            .addSelect('COUNT(*)', 'count')
            .groupBy('log.action')
            .orderBy('count', 'DESC')
            .limit(10)
            .getRawMany();
        const entityStats = await this.auditLogRepository
            .createQueryBuilder('log')
            .select('log.entityType', 'entityType')
            .addSelect('COUNT(*)', 'count')
            .groupBy('log.entityType')
            .orderBy('count', 'DESC')
            .limit(10)
            .getRawMany();
        return {
            total,
            successCount,
            failureCount,
            actionStats: actionStats.map(s => ({ action: s.action, count: parseInt(s.count) })),
            entityStats: entityStats.map(s => ({ entityType: s.entityType, count: parseInt(s.count) })),
        };
    }
    async cleanOldLogs(daysToKeep = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        const result = await this.auditLogRepository
            .createQueryBuilder()
            .delete()
            .where('createdAt < :cutoffDate', { cutoffDate })
            .execute();
        return result.affected || 0;
    }
    async exportToCSV(filters) {
        const { logs } = await this.findAll(filters, 1, 10000);
        const headers = [
            'Data/Ora',
            'Utente',
            'Email',
            'Ruolo',
            'Azione',
            'Entità',
            'Nome Entità',
            'Descrizione',
            'Studio ID',
            'IP',
            'Esito',
            'Errore',
        ];
        const rows = logs.map(log => [
            log.createdAt.toISOString(),
            log.user ? `${log.user.nome} ${log.user.cognome}` : 'N/A',
            log.userEmail || 'N/A',
            log.userRole || 'N/A',
            log.action,
            log.entityType,
            log.entityName || 'N/A',
            log.description || '',
            log.studioId || 'N/A',
            log.ipAddress || 'N/A',
            log.success ? 'OK' : 'ERRORE',
            log.errorMessage || '',
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
        ].join('\n');
        return csvContent;
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map