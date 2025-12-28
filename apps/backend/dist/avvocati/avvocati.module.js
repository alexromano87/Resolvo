"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvvocatiModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const avvocati_service_1 = require("./avvocati.service");
const avvocati_controller_1 = require("./avvocati.controller");
const avvocato_entity_1 = require("./avvocato.entity");
let AvvocatiModule = class AvvocatiModule {
};
exports.AvvocatiModule = AvvocatiModule;
exports.AvvocatiModule = AvvocatiModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([avvocato_entity_1.Avvocato])],
        controllers: [avvocati_controller_1.AvvocatiController],
        providers: [avvocati_service_1.AvvocatiService],
        exports: [avvocati_service_1.AvvocatiService],
    })
], AvvocatiModule);
//# sourceMappingURL=avvocati.module.js.map