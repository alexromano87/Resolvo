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
exports.PraticheController = void 0;
const common_1 = require("@nestjs/common");
const pratiche_service_1 = require("./pratiche.service");
const create_pratica_dto_1 = require("./dto/create-pratica.dto");
const update_pratica_dto_1 = require("./dto/update-pratica.dto");
const cambia_fase_dto_1 = require("./dto/cambia-fase.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let PraticheController = class PraticheController {
    praticheService;
    constructor(praticheService) {
        this.praticheService = praticheService;
    }
    findAll(user, includeInactive, clienteId, debitoreId, page, limit) {
        const includeInact = includeInactive === 'true';
        const pagination = {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        };
        if (clienteId) {
            return this.praticheService.findByClienteForUser(clienteId, user, includeInact, pagination);
        }
        if (debitoreId) {
            return this.praticheService.findByDebitoreForUser(debitoreId, user, includeInact, pagination);
        }
        return this.praticheService.findAllForUser(user, includeInact, pagination);
    }
    async getStats() {
        const [countByStato, totaliFinanziari, countByFase] = await Promise.all([
            this.praticheService.countByStato(),
            this.praticheService.calcolaTotaliFinanziari(),
            this.praticheService.countByFase(),
        ]);
        return {
            ...countByStato,
            ...totaliFinanziari,
            perFase: countByFase,
        };
    }
    findOne(user, id) {
        return this.praticheService.findOneForUser(id, user);
    }
    create(user, dto) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        if (user.ruolo !== 'admin' && user.studioId) {
            dto.studioId = user.studioId;
        }
        return this.praticheService.create(dto);
    }
    async update(user, id, dto) {
        await this.praticheService.findOneForUser(id, user);
        if (user.ruolo === 'segreteria') {
            const allowedKeys = ['avvocatiIds', 'collaboratoriIds'];
            const hasOtherFields = Object.entries(dto).some(([key, value]) => value !== undefined && !allowedKeys.includes(key));
            if (hasOtherFields) {
                throw new common_1.ForbiddenException('La segreteria può solo aggiornare le assegnazioni');
            }
            return this.praticheService.update(id, dto);
        }
        const canModify = await this.praticheService.canUserModifyPratica(user);
        if (!canModify) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.praticheService.update(id, dto);
    }
    async cambiaFase(user, id, dto) {
        await this.praticheService.findOneForUser(id, user);
        const canModify = await this.praticheService.canUserModifyPratica(user);
        if (!canModify) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.praticheService.cambiaFase(id, dto);
    }
    async riapri(user, id, body) {
        await this.praticheService.findOneForUser(id, user);
        const canModify = await this.praticheService.canUserModifyPratica(user);
        if (!canModify) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.praticheService.riapri(id, body?.faseId);
    }
    async deactivate(user, id) {
        await this.praticheService.findOneForUser(id, user);
        const canModify = await this.praticheService.canUserModifyPratica(user);
        if (!canModify) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.praticheService.deactivate(id);
    }
    async reactivate(user, id) {
        await this.praticheService.findOneForUser(id, user);
        const canModify = await this.praticheService.canUserModifyPratica(user);
        if (!canModify) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.praticheService.reactivate(id);
    }
    async remove(user, id) {
        await this.praticheService.findOneForUser(id, user);
        const canModify = await this.praticheService.canUserModifyPratica(user);
        if (!canModify) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.praticheService.remove(id);
    }
};
exports.PraticheController = PraticheController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('includeInactive')),
    __param(2, (0, common_1.Query)('clienteId')),
    __param(3, (0, common_1.Query)('debitoreId')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], PraticheController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PraticheController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PraticheController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_pratica_dto_1.CreatePraticaDto]),
    __metadata("design:returntype", void 0)
], PraticheController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_pratica_dto_1.UpdatePraticaDto]),
    __metadata("design:returntype", Promise)
], PraticheController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/fase'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, cambia_fase_dto_1.CambiaFaseDto]),
    __metadata("design:returntype", Promise)
], PraticheController.prototype, "cambiaFase", null);
__decorate([
    (0, common_1.Patch)(':id/riapri'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PraticheController.prototype, "riapri", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PraticheController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/reactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PraticheController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PraticheController.prototype, "remove", null);
exports.PraticheController = PraticheController = __decorate([
    (0, common_1.Controller)('pratiche'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [pratiche_service_1.PraticheService])
], PraticheController);
//# sourceMappingURL=pratiche.controller.js.map