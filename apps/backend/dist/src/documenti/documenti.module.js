"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentiModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const documento_entity_1 = require("./documento.entity");
const documenti_service_1 = require("./documenti.service");
const documenti_controller_1 = require("./documenti.controller");
const notifications_module_1 = require("../notifications/notifications.module");
const pratiche_module_1 = require("../pratiche/pratiche.module");
const cartelle_module_1 = require("../cartelle/cartelle.module");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
let DocumentiModule = class DocumentiModule {
};
exports.DocumentiModule = DocumentiModule;
exports.DocumentiModule = DocumentiModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([documento_entity_1.Documento, avvocato_entity_1.Avvocato]), notifications_module_1.NotificationsModule, pratiche_module_1.PraticheModule, cartelle_module_1.CartelleModule],
        controllers: [documenti_controller_1.DocumentiController],
        providers: [documenti_service_1.DocumentiService],
        exports: [documenti_service_1.DocumentiService],
    })
], DocumentiModule);
//# sourceMappingURL=documenti.module.js.map