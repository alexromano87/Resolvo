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
exports.CartelleController = void 0;
const common_1 = require("@nestjs/common");
const cartelle_service_1 = require("./cartelle.service");
const create_cartella_dto_1 = require("./dto/create-cartella.dto");
const update_cartella_dto_1 = require("./dto/update-cartella.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const pratiche_service_1 = require("../pratiche/pratiche.service");
let CartelleController = class CartelleController {
    cartelleService;
    praticheService;
    constructor(cartelleService, praticheService) {
        this.cartelleService = cartelleService;
        this.praticheService = praticheService;
    }
    async create(user, createDto) {
        if (user.ruolo !== 'admin' && user.studioId) {
            createDto.studioId = user.studioId;
        }
        return this.cartelleService.create(createDto);
    }
    async findAll(user, includeInactive, page, limit) {
        return this.cartelleService.findAllForUser(user, includeInactive === 'true', {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
    }
    async findByPratica(user, praticaId, includeInactive, page, limit) {
        await this.praticheService.findOneForUser(praticaId, user);
        return this.cartelleService.findByPratica(praticaId, includeInactive === 'true', {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
    }
    async findTree(praticaId) {
        return this.cartelleService.findTree(praticaId);
    }
    async findOne(user, id) {
        await this.assertCartellaAccess(id, user);
        return this.cartelleService.findOne(id);
    }
    async findDescendants(user, id) {
        await this.assertCartellaAccess(id, user);
        return this.cartelleService.findDescendants(id);
    }
    async findAncestors(user, id) {
        await this.assertCartellaAccess(id, user);
        return this.cartelleService.findAncestors(id);
    }
    async update(user, id, updateDto) {
        await this.assertCartellaAccess(id, user);
        return this.cartelleService.update(id, updateDto);
    }
    async deactivate(user, id) {
        await this.assertCartellaAccess(id, user);
        return this.cartelleService.deactivate(id);
    }
    async reactivate(user, id) {
        await this.assertCartellaAccess(id, user);
        return this.cartelleService.reactivate(id);
    }
    async remove(user, id) {
        await this.assertCartellaAccess(id, user);
        return this.cartelleService.remove(id);
    }
    async assertCartellaAccess(id, user) {
        if (!user || user.ruolo === 'admin')
            return;
        const cartella = await this.cartelleService.findOne(id);
        if (cartella.praticaId) {
            await this.praticheService.findOneForUser(cartella.praticaId, user);
            return;
        }
        if (cartella.studioId && cartella.studioId === user.studioId) {
            return;
        }
        throw new common_1.NotFoundException('Cartella non trovata');
    }
};
exports.CartelleController = CartelleController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_cartella_dto_1.CreateCartellaDto]),
    __metadata("design:returntype", Promise)
], CartelleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('includeInactive')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], CartelleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pratica/:praticaId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('praticaId')),
    __param(2, (0, common_1.Query)('includeInactive')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], CartelleController.prototype, "findByPratica", null);
__decorate([
    (0, common_1.Get)('tree'),
    __param(0, (0, common_1.Query)('praticaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartelleController.prototype, "findTree", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartelleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/descendants'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartelleController.prototype, "findDescendants", null);
__decorate([
    (0, common_1.Get)(':id/ancestors'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartelleController.prototype, "findAncestors", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_cartella_dto_1.UpdateCartellaDto]),
    __metadata("design:returntype", Promise)
], CartelleController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartelleController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/reactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartelleController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartelleController.prototype, "remove", null);
exports.CartelleController = CartelleController = __decorate([
    (0, common_1.Controller)('cartelle'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [cartelle_service_1.CartelleService,
        pratiche_service_1.PraticheService])
], CartelleController);
//# sourceMappingURL=cartelle.controller.js.map