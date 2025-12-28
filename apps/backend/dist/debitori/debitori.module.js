"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebitoriModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const debitore_entity_1 = require("./debitore.entity");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const debitori_service_1 = require("./debitori.service");
const debitori_controller_1 = require("./debitori.controller");
const clienti_debitori_module_1 = require("../relazioni/clienti-debitori.module");
let DebitoriModule = class DebitoriModule {
};
exports.DebitoriModule = DebitoriModule;
exports.DebitoriModule = DebitoriModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([debitore_entity_1.Debitore, pratica_entity_1.Pratica, avvocato_entity_1.Avvocato]),
            clienti_debitori_module_1.ClientiDebitoriModule,
        ],
        controllers: [debitori_controller_1.DebitoriController],
        providers: [debitori_service_1.DebitoriService],
    })
], DebitoriModule);
//# sourceMappingURL=debitori.module.js.map