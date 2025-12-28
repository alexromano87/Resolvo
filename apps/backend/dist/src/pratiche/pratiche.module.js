"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PraticheModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pratica_entity_1 = require("./pratica.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const user_entity_1 = require("../users/user.entity");
const pratiche_service_1 = require("./pratiche.service");
const pratiche_controller_1 = require("./pratiche.controller");
const fasi_module_1 = require("../fasi/fasi.module");
const notifications_module_1 = require("../notifications/notifications.module");
let PraticheModule = class PraticheModule {
};
exports.PraticheModule = PraticheModule;
exports.PraticheModule = PraticheModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([pratica_entity_1.Pratica, avvocato_entity_1.Avvocato, user_entity_1.User]), fasi_module_1.FasiModule, notifications_module_1.NotificationsModule],
        controllers: [pratiche_controller_1.PraticheController],
        providers: [pratiche_service_1.PraticheService],
        exports: [pratiche_service_1.PraticheService],
    })
], PraticheModule);
//# sourceMappingURL=pratiche.module.js.map