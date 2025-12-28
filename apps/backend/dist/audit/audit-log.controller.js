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
exports.AuditLogController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_guard_1 = require("../auth/admin.guard");
const audit_log_service_1 = require("./audit-log.service");
let AuditLogController = class AuditLogController {
    auditLogService;
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }
    async getLogs(userId, studioId, entityType, action, startDate, endDate, success, search, page, limit) {
        const filters = {};
        if (userId)
            filters.userId = userId;
        if (studioId !== undefined)
            filters.studioId = studioId;
        if (entityType)
            filters.entityType = entityType;
        if (action)
            filters.action = action;
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        if (success !== undefined)
            filters.success = success === 'true';
        if (search)
            filters.search = search;
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 100;
        return this.auditLogService.findAll(Object.keys(filters).length > 0 ? filters : undefined, pageNum, limitNum);
    }
    async getStats(userId, studioId, startDate, endDate) {
        const filters = {};
        if (userId)
            filters.userId = userId;
        if (studioId !== undefined)
            filters.studioId = studioId;
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        return this.auditLogService.getStats(Object.keys(filters).length > 0 ? filters : undefined);
    }
    async exportLogs(res, userId, studioId, entityType, action, startDate, endDate, success, search) {
        const filters = {};
        if (userId)
            filters.userId = userId;
        if (studioId !== undefined)
            filters.studioId = studioId;
        if (entityType)
            filters.entityType = entityType;
        if (action)
            filters.action = action;
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        if (success !== undefined)
            filters.success = success === 'true';
        if (search)
            filters.search = search;
        const csvContent = await this.auditLogService.exportToCSV(Object.keys(filters).length > 0 ? filters : undefined);
        const filename = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(common_1.HttpStatus.OK).send(csvContent);
    }
    async cleanupOldLogs(body) {
        const daysToKeep = body.daysToKeep || 90;
        const deletedCount = await this.auditLogService.cleanOldLogs(daysToKeep);
        return {
            message: `Eliminati ${deletedCount} log più vecchi di ${daysToKeep} giorni`,
            deletedCount,
            daysToKeep,
        };
    }
};
exports.AuditLogController = AuditLogController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('studioId')),
    __param(2, (0, common_1.Query)('entityType')),
    __param(3, (0, common_1.Query)('action')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __param(6, (0, common_1.Query)('success')),
    __param(7, (0, common_1.Query)('search')),
    __param(8, (0, common_1.Query)('page')),
    __param(9, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('studioId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Query)('studioId')),
    __param(3, (0, common_1.Query)('entityType')),
    __param(4, (0, common_1.Query)('action')),
    __param(5, (0, common_1.Query)('startDate')),
    __param(6, (0, common_1.Query)('endDate')),
    __param(7, (0, common_1.Query)('success')),
    __param(8, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "exportLogs", null);
__decorate([
    (0, common_1.Delete)('cleanup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "cleanupOldLogs", null);
exports.AuditLogController = AuditLogController = __decorate([
    (0, common_1.Controller)('admin/audit-logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [audit_log_service_1.AuditLogService])
], AuditLogController);
//# sourceMappingURL=audit-log.controller.js.map