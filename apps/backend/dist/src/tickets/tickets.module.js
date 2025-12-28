"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tickets_service_1 = require("./tickets.service");
const tickets_controller_1 = require("./tickets.controller");
const ticket_entity_1 = require("./ticket.entity");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const studio_entity_1 = require("../studi/studio.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const notifications_module_1 = require("../notifications/notifications.module");
const alerts_module_1 = require("../alerts/alerts.module");
let TicketsModule = class TicketsModule {
};
exports.TicketsModule = TicketsModule;
exports.TicketsModule = TicketsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ticket_entity_1.Ticket, pratica_entity_1.Pratica, studio_entity_1.Studio, avvocato_entity_1.Avvocato]), notifications_module_1.NotificationsModule, alerts_module_1.AlertsModule],
        controllers: [tickets_controller_1.TicketsController],
        providers: [tickets_service_1.TicketsService],
        exports: [tickets_service_1.TicketsService],
    })
], TicketsModule);
//# sourceMappingURL=tickets.module.js.map