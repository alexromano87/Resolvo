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
exports.AlertsController = void 0;
const common_1 = require("@nestjs/common");
const alerts_service_1 = require("./alerts.service");
const create_alert_dto_1 = require("./dto/create-alert.dto");
const update_alert_dto_1 = require("./dto/update-alert.dto");
const add_messaggio_dto_1 = require("./dto/add-messaggio.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let AlertsController = class AlertsController {
    alertsService;
    constructor(alertsService) {
        this.alertsService = alertsService;
    }
    create(user, createAlertDto) {
        if (user.ruolo !== 'admin' && user.studioId) {
            createAlertDto.studioId = user.studioId;
        }
        return this.alertsService.create(createAlertDto);
    }
    findAll(user, includeInactive, page, limit) {
        return this.alertsService.findAllForUser(user, includeInactive, {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
    }
    findAllByPratica(user, praticaId, includeInactive, page, limit) {
        return this.alertsService.findAllByPraticaForUser(praticaId, user, includeInactive, {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
    }
    findAllByStato(user, stato, includeInactive, page, limit) {
        return this.alertsService.findAllByStatoForUser(stato, user, includeInactive, {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
    }
    findOne(user, id) {
        return this.alertsService.findOneForUser(id, user);
    }
    update(user, id, updateAlertDto) {
        return this.alertsService.update(id, updateAlertDto, user);
    }
    deactivate(user, id) {
        return this.alertsService.deactivate(id, user);
    }
    reactivate(user, id) {
        return this.alertsService.reactivate(id, user);
    }
    remove(user, id) {
        return this.alertsService.remove(id, user);
    }
    addMessaggio(user, id, addMessaggioDto) {
        return this.alertsService.addMessaggio(id, addMessaggioDto, user);
    }
    chiudiAlert(user, id) {
        return this.alertsService.update(id, { stato: 'chiuso' }, user);
    }
    riapriAlert(user, id) {
        return this.alertsService.update(id, { stato: 'in_gestione' }, user);
    }
};
exports.AlertsController = AlertsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_alert_dto_1.CreateAlertDto]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('includeInactive', new common_1.ParseBoolPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean, String, String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pratica/:praticaId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('praticaId')),
    __param(2, (0, common_1.Query)('includeInactive', new common_1.ParseBoolPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Boolean, String, String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "findAllByPratica", null);
__decorate([
    (0, common_1.Get)('stato/:stato'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('stato')),
    __param(2, (0, common_1.Query)('includeInactive', new common_1.ParseBoolPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Boolean, String, String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "findAllByStato", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_alert_dto_1.UpdateAlertDto]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/reactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/messaggi'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_messaggio_dto_1.AddMessaggioDto]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "addMessaggio", null);
__decorate([
    (0, common_1.Patch)(':id/chiudi'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "chiudiAlert", null);
__decorate([
    (0, common_1.Patch)(':id/riapri'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "riapriAlert", null);
exports.AlertsController = AlertsController = __decorate([
    (0, common_1.Controller)('alerts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [alerts_service_1.AlertsService])
], AlertsController);
//# sourceMappingURL=alerts.controller.js.map