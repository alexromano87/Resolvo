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
exports.AvvocatiController = void 0;
const common_1 = require("@nestjs/common");
const avvocati_service_1 = require("./avvocati.service");
const create_avvocato_dto_1 = require("./create-avvocato.dto");
const update_avvocato_dto_1 = require("./update-avvocato.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let AvvocatiController = class AvvocatiController {
    avvocatiService;
    constructor(avvocatiService) {
        this.avvocatiService = avvocatiService;
    }
    create(user, createAvvocatoDto) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        if (user.ruolo !== 'admin' && user.studioId) {
            createAvvocatoDto.studioId = user.studioId;
        }
        return this.avvocatiService.create(createAvvocatoDto);
    }
    findAll(user, includeInactive, page, limit) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        const studioId = user.ruolo === 'admin' ? undefined : user.studioId || undefined;
        return this.avvocatiService.findAll(includeInactive, studioId, {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
    }
    findOne(id) {
        return this.avvocatiService.findOne(id);
    }
    update(user, id, updateAvvocatoDto) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.avvocatiService.update(id, updateAvvocatoDto);
    }
    deactivate(user, id) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.avvocatiService.deactivate(id);
    }
    reactivate(user, id) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.avvocatiService.reactivate(id);
    }
    remove(user, id) {
        if (!['admin', 'titolare_studio', 'segreteria'].includes(user.ruolo)) {
            throw new common_1.ForbiddenException('Accesso non consentito');
        }
        return this.avvocatiService.remove(id);
    }
};
exports.AvvocatiController = AvvocatiController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_avvocato_dto_1.CreateAvvocatoDto]),
    __metadata("design:returntype", void 0)
], AvvocatiController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('includeInactive', new common_1.ParseBoolPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean, String, String]),
    __metadata("design:returntype", void 0)
], AvvocatiController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AvvocatiController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_avvocato_dto_1.UpdateAvvocatoDto]),
    __metadata("design:returntype", void 0)
], AvvocatiController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AvvocatiController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/reactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AvvocatiController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AvvocatiController.prototype, "remove", null);
exports.AvvocatiController = AvvocatiController = __decorate([
    (0, common_1.Controller)('avvocati'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [avvocati_service_1.AvvocatiService])
], AvvocatiController);
//# sourceMappingURL=avvocati.controller.js.map