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
exports.ExportController = void 0;
const common_1 = require("@nestjs/common");
const export_service_1 = require("./export.service");
const export_request_dto_1 = require("./dto/export-request.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_guard_1 = require("../auth/admin.guard");
const audit_log_service_1 = require("../audit/audit-log.service");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let ExportController = class ExportController {
    exportService;
    auditLogService;
    constructor(exportService, auditLogService) {
        this.exportService = exportService;
        this.auditLogService = auditLogService;
    }
    async exportData(user, dto, res) {
        try {
            const buffer = await this.exportService.exportData(dto);
            try {
                await this.auditLogService.log({
                    userId: user.id,
                    studioId: dto.studioId || user.studioId,
                    action: 'EXPORT_DATA',
                    entityType: 'SYSTEM',
                    description: `Export ${dto.entity} in formato ${dto.format}`,
                    metadata: {
                        format: dto.format,
                        entity: dto.entity,
                        studioId: dto.studioId,
                        filters: {
                            dataInizio: dto.dataInizio,
                            dataFine: dto.dataFine,
                            includeInactive: dto.includeInactive,
                        },
                    },
                });
            }
            catch (logError) {
                console.warn('Audit log export fallito:', logError);
            }
            const filename = `export_${dto.entity}_${new Date().toISOString().split('T')[0]}`;
            let contentType = 'application/octet-stream';
            let extension = dto.format;
            switch (dto.format) {
                case 'csv':
                    contentType = 'text/csv';
                    break;
                case 'xlsx':
                    contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    break;
                case 'json':
                    contentType = 'application/json';
                    break;
            }
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.${extension}"`);
            res.send(buffer);
        }
        catch (error) {
            console.error('Error exporting data:', error);
            throw new common_1.HttpException('Errore durante l\'esportazione dei dati', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async backupStudio(user, dto, res) {
        try {
            const buffer = await this.exportService.backupStudio(dto.studioId, dto.includeDocuments, dto.includeAuditLogs);
            try {
                await this.auditLogService.log({
                    userId: user.id,
                    studioId: dto.studioId,
                    action: 'BACKUP_STUDIO',
                    entityType: 'STUDIO',
                    entityId: dto.studioId,
                    description: `Backup completo studio`,
                    metadata: {
                        includeDocuments: dto.includeDocuments,
                        includeAuditLogs: dto.includeAuditLogs,
                    },
                });
            }
            catch (logError) {
                console.warn('Audit log backup fallito:', logError);
            }
            const filename = `backup_studio_${dto.studioId}_${new Date().toISOString().split('T')[0]}.json`;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(buffer);
        }
        catch (error) {
            console.error('Error backing up studio:', error);
            throw new common_1.HttpException('Errore durante il backup dello studio', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ExportController = ExportController;
__decorate([
    (0, common_1.Post)('data'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, export_request_dto_1.ExportRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "exportData", null);
__decorate([
    (0, common_1.Post)('backup-studio'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, export_request_dto_1.BackupStudioDto, Object]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "backupStudio", null);
exports.ExportController = ExportController = __decorate([
    (0, common_1.Controller)('export'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [export_service_1.ExportService,
        audit_log_service_1.AuditLogService])
], ExportController);
//# sourceMappingURL=export.controller.js.map