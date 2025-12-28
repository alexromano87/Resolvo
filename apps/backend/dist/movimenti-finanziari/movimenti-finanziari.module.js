"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovimentiFinanziariModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const movimenti_finanziari_service_1 = require("./movimenti-finanziari.service");
const movimenti_finanziari_controller_1 = require("./movimenti-finanziari.controller");
const movimento_finanziario_entity_1 = require("./movimento-finanziario.entity");
let MovimentiFinanziariModule = class MovimentiFinanziariModule {
};
exports.MovimentiFinanziariModule = MovimentiFinanziariModule;
exports.MovimentiFinanziariModule = MovimentiFinanziariModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([movimento_finanziario_entity_1.MovimentoFinanziario])],
        controllers: [movimenti_finanziari_controller_1.MovimentiFinanziariController],
        providers: [movimenti_finanziari_service_1.MovimentiFinanziariService],
        exports: [movimenti_finanziari_service_1.MovimentiFinanziariService],
    })
], MovimentiFinanziariModule);
//# sourceMappingURL=movimenti-finanziari.module.js.map