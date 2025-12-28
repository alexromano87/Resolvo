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
exports.ImportController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const import_service_1 = require("./import.service");
const import_request_dto_1 = require("./dto/import-request.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_guard_1 = require("../auth/admin.guard");
const audit_log_service_1 = require("../audit/audit-log.service");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const rate_limit_decorator_1 = require("../common/rate-limit.decorator");
const rate_limit_guard_1 = require("../common/rate-limit.guard");
let ImportController = class ImportController {
    importService;
    auditLogService;
    constructor(importService, auditLogService) {
        this.importService = importService;
        this.auditLogService = auditLogService;
    }
    async importBackup(user, file) {
        if (!file) {
            throw new common_1.HttpException('File mancante', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.importService.importBackup(file.buffer);
            try {
                await this.auditLogService.log({
                    userId: user.id,
                    studioId: user.studioId,
                    action: 'IMPORT_DATA',
                    entityType: 'SYSTEM',
                    description: 'Import backup JSON',
                    metadata: {
                        filename: file.originalname,
                        results: result.results,
                    },
                });
            }
            catch (logError) {
                console.warn('Audit log import backup fallito:', logError);
            }
            return result;
        }
        catch (error) {
            console.error('Errore import backup:', error);
            throw new common_1.HttpException(error?.message || 'Errore durante l\'import del backup', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async importCsv(user, dto, file) {
        if (!file) {
            throw new common_1.HttpException('File mancante', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.importService.importCsv(dto.entity, file.buffer);
            try {
                await this.auditLogService.log({
                    userId: user.id,
                    studioId: user.studioId,
                    action: 'IMPORT_DATA',
                    entityType: dto.entity === 'clienti' ? 'CLIENTE' : 'DEBITORE',
                    description: `Import CSV ${dto.entity}`,
                    metadata: {
                        filename: file.originalname,
                        result,
                    },
                });
            }
            catch (logError) {
                console.warn('Audit log import CSV fallito:', logError);
            }
            return result;
        }
        catch (error) {
            console.error('Errore import CSV:', error);
            throw new common_1.HttpException(error?.message || 'Errore durante l\'import CSV', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ImportController = ImportController;
__decorate([
    (0, common_1.Post)('backup'),
    (0, common_1.UseGuards)(rate_limit_guard_1.RateLimitGuard),
    (0, rate_limit_decorator_1.RateLimit)({ limit: 5, windowMs: 10 * 60 * 1000 }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 50 * 1024 * 1024 },
    })),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "importBackup", null);
__decorate([
    (0, common_1.Post)('csv'),
    (0, common_1.UseGuards)(rate_limit_guard_1.RateLimitGuard),
    (0, rate_limit_decorator_1.RateLimit)({ limit: 10, windowMs: 10 * 60 * 1000 }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 20 * 1024 * 1024 },
    })),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, import_request_dto_1.ImportCsvDto, Object]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "importCsv", null);
exports.ImportController = ImportController = __decorate([
    (0, common_1.Controller)('import'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [import_service_1.ImportService,
        audit_log_service_1.AuditLogService])
], ImportController);
//# sourceMappingURL=import.controller.js.map