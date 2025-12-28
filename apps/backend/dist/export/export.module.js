"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const export_controller_1 = require("./export.controller");
const export_service_1 = require("./export.service");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const cliente_entity_1 = require("../clienti/cliente.entity");
const debitore_entity_1 = require("../debitori/debitore.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const movimento_finanziario_entity_1 = require("../movimenti-finanziari/movimento-finanziario.entity");
const documento_entity_1 = require("../documenti/documento.entity");
const alert_entity_1 = require("../alerts/alert.entity");
const ticket_entity_1 = require("../tickets/ticket.entity");
const audit_log_entity_1 = require("../audit/audit-log.entity");
const user_entity_1 = require("../users/user.entity");
const audit_log_module_1 = require("../audit/audit-log.module");
let ExportModule = class ExportModule {
};
exports.ExportModule = ExportModule;
exports.ExportModule = ExportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                pratica_entity_1.Pratica,
                cliente_entity_1.Cliente,
                debitore_entity_1.Debitore,
                avvocato_entity_1.Avvocato,
                movimento_finanziario_entity_1.MovimentoFinanziario,
                documento_entity_1.Documento,
                alert_entity_1.Alert,
                ticket_entity_1.Ticket,
                audit_log_entity_1.AuditLog,
                user_entity_1.User,
            ]),
            audit_log_module_1.AuditLogModule,
        ],
        controllers: [export_controller_1.ExportController],
        providers: [export_service_1.ExportService],
        exports: [export_service_1.ExportService],
    })
], ExportModule);
//# sourceMappingURL=export.module.js.map