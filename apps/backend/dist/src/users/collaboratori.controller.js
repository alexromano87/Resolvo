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
exports.CollaboratoriController = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const users_service_1 = require("./users.service");
const create_collaboratore_dto_1 = require("./dto/create-collaboratore.dto");
const update_collaboratore_dto_1 = require("./dto/update-collaboratore.dto");
let CollaboratoriController = class CollaboratoriController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(user, includeInactive, page, limit) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        const filters = {
            ruolo: 'collaboratore',
        };
        if (user.ruolo !== 'admin') {
            if (!user.studioId) {
                return [];
            }
            filters.studioId = user.studioId;
        }
        if (!includeInactive) {
            filters.attivo = true;
        }
        return this.usersService.findAll(filters, {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
    }
    async create(user, createDto) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        const isAdmin = user.ruolo === 'admin';
        if (!isAdmin) {
            if (!user.studioId) {
                throw new common_1.ForbiddenException('Studio non associato');
            }
            createDto.studioId = user.studioId;
        }
        const password = createDto.password ??
            (isAdmin
                ? undefined
                : (0, crypto_1.randomBytes)(12).toString('base64url'));
        if (isAdmin && !password) {
            throw new common_1.BadRequestException('Password obbligatoria');
        }
        const created = await this.usersService.create({
            email: createDto.email,
            password: password,
            nome: createDto.nome,
            cognome: createDto.cognome,
            telefono: createDto.telefono ?? null,
            ruolo: 'collaboratore',
            studioId: createDto.studioId ?? null,
            clienteId: null,
        });
        if (!isAdmin) {
            return this.usersService.update(created.id, { attivo: false });
        }
        return created;
    }
    async update(user, id, updateDto) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        const collaborator = await this.usersService.findOne(id);
        if (!collaborator || collaborator.ruolo !== 'collaboratore') {
            throw new common_1.NotFoundException('Collaboratore non trovato');
        }
        if (user.ruolo !== 'admin' && collaborator.studioId !== user.studioId) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.usersService.update(id, {
            email: updateDto.email,
            password: updateDto.password,
            nome: updateDto.nome,
            cognome: updateDto.cognome,
            telefono: updateDto.telefono ?? undefined,
        });
    }
    async deactivate(user, id) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        const collaborator = await this.usersService.findOne(id);
        if (!collaborator || collaborator.ruolo !== 'collaboratore') {
            throw new common_1.NotFoundException('Collaboratore non trovato');
        }
        if (user.ruolo !== 'admin' && collaborator.studioId !== user.studioId) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.usersService.update(id, { attivo: false });
    }
    async reactivate(user, id) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        const collaborator = await this.usersService.findOne(id);
        if (!collaborator || collaborator.ruolo !== 'collaboratore') {
            throw new common_1.NotFoundException('Collaboratore non trovato');
        }
        if (user.ruolo !== 'admin' && collaborator.studioId !== user.studioId) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.usersService.update(id, { attivo: true });
    }
    async remove(user, id) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        const collaborator = await this.usersService.findOne(id);
        if (!collaborator || collaborator.ruolo !== 'collaboratore') {
            throw new common_1.NotFoundException('Collaboratore non trovato');
        }
        if (user.ruolo !== 'admin' && collaborator.studioId !== user.studioId) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        await this.usersService.remove(id);
        return { success: true };
    }
};
exports.CollaboratoriController = CollaboratoriController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('includeInactive', new common_1.ParseBoolPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean, String, String]),
    __metadata("design:returntype", Promise)
], CollaboratoriController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_collaboratore_dto_1.CreateCollaboratoreDto]),
    __metadata("design:returntype", Promise)
], CollaboratoriController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_collaboratore_dto_1.UpdateCollaboratoreDto]),
    __metadata("design:returntype", Promise)
], CollaboratoriController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CollaboratoriController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/reactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CollaboratoriController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CollaboratoriController.prototype, "remove", null);
exports.CollaboratoriController = CollaboratoriController = __decorate([
    (0, common_1.Controller)('collaboratori'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], CollaboratoriController);
//# sourceMappingURL=collaboratori.controller.js.map