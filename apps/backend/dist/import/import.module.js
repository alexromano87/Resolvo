"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const import_controller_1 = require("./import.controller");
const import_service_1 = require("./import.service");
const cliente_entity_1 = require("../clienti/cliente.entity");
const debitore_entity_1 = require("../debitori/debitore.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const movimento_finanziario_entity_1 = require("../movimenti-finanziari/movimento-finanziario.entity");
const documento_entity_1 = require("../documenti/documento.entity");
const alert_entity_1 = require("../alerts/alert.entity");
const ticket_entity_1 = require("../tickets/ticket.entity");
const audit_log_entity_1 = require("../audit/audit-log.entity");
const user_entity_1 = require("../users/user.entity");
const audit_log_service_1 = require("../audit/audit-log.service");
let ImportModule = class ImportModule {
};
exports.ImportModule = ImportModule;
exports.ImportModule = ImportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                cliente_entity_1.Cliente,
                debitore_entity_1.Debitore,
                avvocato_entity_1.Avvocato,
                pratica_entity_1.Pratica,
                movimento_finanziario_entity_1.MovimentoFinanziario,
                documento_entity_1.Documento,
                alert_entity_1.Alert,
                ticket_entity_1.Ticket,
                audit_log_entity_1.AuditLog,
                user_entity_1.User,
            ]),
        ],
        controllers: [import_controller_1.ImportController],
        providers: [import_service_1.ImportService, audit_log_service_1.AuditLogService],
    })
], ImportModule);
//# sourceMappingURL=import.module.js.map