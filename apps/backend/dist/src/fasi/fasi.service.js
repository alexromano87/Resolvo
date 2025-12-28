"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FasiService = void 0;
const common_1 = require("@nestjs/common");
const fasi_constants_1 = require("./fasi.constants");
let FasiService = class FasiService {
    findAll() {
        return [...fasi_constants_1.FASI].sort((a, b) => a.ordine - b.ordine);
    }
    findOne(id) {
        const fase = (0, fasi_constants_1.getFaseById)(id);
        if (!fase) {
            throw new common_1.NotFoundException(`Fase con ID ${id} non trovata`);
        }
        return fase;
    }
    findByCodice(codice) {
        return (0, fasi_constants_1.getFaseByCodice)(codice);
    }
    getDefaultFase() {
        return this.findOne(fasi_constants_1.FASE_DEFAULT_ID);
    }
    getDefaultFaseId() {
        return fasi_constants_1.FASE_DEFAULT_ID;
    }
    isFaseChiusura(faseId) {
        const fase = (0, fasi_constants_1.getFaseById)(faseId);
        return fase?.isFaseChiusura ?? false;
    }
};
exports.FasiService = FasiService;
exports.FasiService = FasiService = __decorate([
    (0, common_1.Injectable)()
], FasiService);
//# sourceMappingURL=fasi.service.js.map