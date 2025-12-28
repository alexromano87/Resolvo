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
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const tickets_service_1 = require("./tickets.service");
const create_ticket_dto_1 = require("./dto/create-ticket.dto");
const update_ticket_dto_1 = require("./dto/update-ticket.dto");
const add_messaggio_dto_1 = require("./dto/add-messaggio.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let TicketsController = class TicketsController {
    ticketsService;
    constructor(ticketsService) {
        this.ticketsService = ticketsService;
    }
    create(user, createTicketDto) {
        return this.ticketsService.createForUser(user, createTicketDto);
    }
    findAll(user, includeInactive, page, limit) {
        return this.ticketsService.findAllForUser(user, includeInactive, {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
    }
    findAllByPratica(user, praticaId, includeInactive, page, limit) {
        return this.ticketsService.findAllByPraticaForUser(praticaId, user, includeInactive, {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
    }
    findAllByStato(user, stato, includeInactive, page, limit) {
        return this.ticketsService.findAllByStatoForUser(stato, user, includeInactive, {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
    }
    findOne(user, id) {
        return this.ticketsService.findOneForUser(id, user);
    }
    update(user, id, updateTicketDto) {
        return this.ticketsService.update(id, updateTicketDto, user);
    }
    deactivate(user, id) {
        return this.ticketsService.deactivate(id, user);
    }
    reactivate(user, id) {
        return this.ticketsService.reactivate(id, user);
    }
    remove(user, id) {
        return this.ticketsService.remove(id, user);
    }
    addMessaggio(user, id, addMessaggioDto) {
        return this.ticketsService.addMessaggio(id, addMessaggioDto, user);
    }
    chiudiTicket(user, id) {
        return this.ticketsService.chiudiTicket(id, user);
    }
    prendiInCarico(user, id) {
        return this.ticketsService.prendiInCarico(id, user);
    }
    riapriTicket(user, id) {
        return this.ticketsService.riapriTicket(id, user);
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_ticket_dto_1.CreateTicketDto]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('includeInactive', new common_1.ParseBoolPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean, String, String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findAll", null);
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
], TicketsController.prototype, "findAllByPratica", null);
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
], TicketsController.prototype, "findAllByStato", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_ticket_dto_1.UpdateTicketDto]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/reactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/messaggi'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_messaggio_dto_1.AddMessaggioDto]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "addMessaggio", null);
__decorate([
    (0, common_1.Patch)(':id/chiudi'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "chiudiTicket", null);
__decorate([
    (0, common_1.Patch)(':id/prendi-in-carico'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "prendiInCarico", null);
__decorate([
    (0, common_1.Patch)(':id/riapri'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "riapriTicket", null);
exports.TicketsController = TicketsController = __decorate([
    (0, common_1.Controller)('tickets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [tickets_service_1.TicketsService])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map