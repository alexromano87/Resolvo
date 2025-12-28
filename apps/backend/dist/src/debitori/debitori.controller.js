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
exports.DebitoriController = void 0;
const common_1 = require("@nestjs/common");
const debitori_service_1 = require("./debitori.service");
const create_debitore_dto_1 = require("./dto/create-debitore.dto");
const update_debitore_dto_1 = require("./dto/update-debitore.dto");
const clienti_debitori_service_1 = require("../relazioni/clienti-debitori.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let DebitoriController = class DebitoriController {
    debitoriService;
    clientiDebitoriService;
    constructor(debitoriService, clientiDebitoriService) {
        this.debitoriService = debitoriService;
        this.clientiDebitoriService = clientiDebitoriService;
    }
    findAll(user, includeInactive, withClientiCount, page, limit) {
        const includeInact = includeInactive === 'true';
        if (withClientiCount === 'true') {
            return this.debitoriService.findAllWithClientiCountForUser(user, includeInact, {
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
            });
        }
        return this.debitoriService.findAllForUser(user, includeInact, {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
    }
    async findOne(user, id) {
        const canAccess = await this.debitoriService.canAccessDebitore(user, id);
        if (!canAccess) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.debitoriService.findOne(id);
    }
    async getClientiForDebitore(user, id) {
        const canAccess = await this.debitoriService.canAccessDebitore(user, id);
        if (!canAccess) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        const clientiIds = await this.clientiDebitoriService.getClientiByDebitore(id);
        return { clientiIds };
    }
    async getPraticheCount(user, id) {
        const canAccess = await this.debitoriService.canAccessDebitore(user, id);
        if (!canAccess) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        const count = await this.debitoriService.countPraticheCollegate(id);
        return { count };
    }
    create(user, dto) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        if (user.ruolo !== 'admin' && user.studioId) {
            dto.studioId = user.studioId;
        }
        return this.debitoriService.create(dto);
    }
    update(user, id, dto) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.debitoriService.update(id, dto);
    }
    deactivate(user, id) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.debitoriService.deactivate(id);
    }
    reactivate(user, id) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.debitoriService.reactivate(id);
    }
    remove(user, id) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.debitoriService.remove(id);
    }
};
exports.DebitoriController = DebitoriController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('includeInactive')),
    __param(2, (0, common_1.Query)('withClientiCount')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], DebitoriController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DebitoriController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/clienti'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DebitoriController.prototype, "getClientiForDebitore", null);
__decorate([
    (0, common_1.Get)(':id/pratiche-count'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DebitoriController.prototype, "getPraticheCount", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_debitore_dto_1.CreateDebitoreDto]),
    __metadata("design:returntype", void 0)
], DebitoriController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_debitore_dto_1.UpdateDebitoreDto]),
    __metadata("design:returntype", void 0)
], DebitoriController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DebitoriController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/reactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DebitoriController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DebitoriController.prototype, "remove", null);
exports.DebitoriController = DebitoriController = __decorate([
    (0, common_1.Controller)('debitori'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [debitori_service_1.DebitoriService,
        clienti_debitori_service_1.ClientiDebitoriService])
], DebitoriController);
//# sourceMappingURL=debitori.controller.js.map