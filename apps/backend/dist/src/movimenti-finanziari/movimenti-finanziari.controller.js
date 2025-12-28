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
exports.MovimentiFinanziariController = void 0;
const common_1 = require("@nestjs/common");
const movimenti_finanziari_service_1 = require("./movimenti-finanziari.service");
const create_movimento_finanziario_dto_1 = require("./create-movimento-finanziario.dto");
const update_movimento_finanziario_dto_1 = require("./update-movimento-finanziario.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let MovimentiFinanziariController = class MovimentiFinanziariController {
    movimentiService;
    constructor(movimentiService) {
        this.movimentiService = movimentiService;
    }
    create(user, createMovimentoDto) {
        if (user.ruolo !== 'admin' && user.studioId) {
            createMovimentoDto.studioId = user.studioId;
        }
        return this.movimentiService.create(createMovimentoDto);
    }
    findAllByPratica(user, praticaId) {
        const studioId = user.ruolo === 'admin' ? undefined : user.studioId || undefined;
        return this.movimentiService.findAllByPratica(praticaId, studioId);
    }
    getTotaliByPratica(user, praticaId) {
        const studioId = user.ruolo === 'admin' ? undefined : user.studioId || undefined;
        return this.movimentiService.getTotaliByPratica(praticaId, studioId);
    }
    findOne(id) {
        return this.movimentiService.findOne(id);
    }
    update(id, updateMovimentoDto) {
        return this.movimentiService.update(id, updateMovimentoDto);
    }
    remove(id) {
        return this.movimentiService.remove(id);
    }
};
exports.MovimentiFinanziariController = MovimentiFinanziariController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_movimento_finanziario_dto_1.CreateMovimentoFinanziarioDto]),
    __metadata("design:returntype", void 0)
], MovimentiFinanziariController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('pratica/:praticaId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('praticaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MovimentiFinanziariController.prototype, "findAllByPratica", null);
__decorate([
    (0, common_1.Get)('pratica/:praticaId/totali'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('praticaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MovimentiFinanziariController.prototype, "getTotaliByPratica", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MovimentiFinanziariController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_movimento_finanziario_dto_1.UpdateMovimentoFinanziarioDto]),
    __metadata("design:returntype", void 0)
], MovimentiFinanziariController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MovimentiFinanziariController.prototype, "remove", null);
exports.MovimentiFinanziariController = MovimentiFinanziariController = __decorate([
    (0, common_1.Controller)('movimenti-finanziari'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [movimenti_finanziari_service_1.MovimentiFinanziariService])
], MovimentiFinanziariController);
//# sourceMappingURL=movimenti-finanziari.controller.js.map