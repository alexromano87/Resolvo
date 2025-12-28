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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovimentoFinanziario = void 0;
const typeorm_1 = require("typeorm");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const studio_entity_1 = require("../studi/studio.entity");
let MovimentoFinanziario = class MovimentoFinanziario {
    id;
    studioId;
    studio;
    praticaId;
    pratica;
    tipo;
    importo;
    data;
    oggetto;
    createdAt;
    updatedAt;
};
exports.MovimentoFinanziario = MovimentoFinanziario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MovimentoFinanziario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], MovimentoFinanziario.prototype, "studioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => studio_entity_1.Studio, (studio) => studio.movimentiFinanziari, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'studioId' }),
    __metadata("design:type", Object)
], MovimentoFinanziario.prototype, "studio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MovimentoFinanziario.prototype, "praticaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pratica_entity_1.Pratica, (pratica) => pratica.movimentiFinanziari, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'praticaId' }),
    __metadata("design:type", pratica_entity_1.Pratica)
], MovimentoFinanziario.prototype, "pratica", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], MovimentoFinanziario.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], MovimentoFinanziario.prototype, "importo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], MovimentoFinanziario.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MovimentoFinanziario.prototype, "oggetto", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MovimentoFinanziario.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MovimentoFinanziario.prototype, "updatedAt", void 0);
exports.MovimentoFinanziario = MovimentoFinanziario = __decorate([
    (0, typeorm_1.Entity)('movimenti_finanziari')
], MovimentoFinanziario);
//# sourceMappingURL=movimento-finanziario.entity.js.map