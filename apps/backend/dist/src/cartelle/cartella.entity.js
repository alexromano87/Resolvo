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
exports.Cartella = void 0;
const typeorm_1 = require("typeorm");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const documento_entity_1 = require("../documenti/documento.entity");
const studio_entity_1 = require("../studi/studio.entity");
let Cartella = class Cartella {
    id;
    studioId;
    studio;
    nome;
    descrizione;
    colore;
    praticaId;
    pratica;
    cartellaParent;
    sottoCartelle;
    documenti;
    attivo;
    dataCreazione;
    dataAggiornamento;
};
exports.Cartella = Cartella;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Cartella.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Cartella.prototype, "studioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => studio_entity_1.Studio, (studio) => studio.cartelle, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'studioId' }),
    __metadata("design:type", Object)
], Cartella.prototype, "studio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Cartella.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], Cartella.prototype, "descrizione", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Cartella.prototype, "colore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Cartella.prototype, "praticaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pratica_entity_1.Pratica, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'praticaId' }),
    __metadata("design:type", Object)
], Cartella.prototype, "pratica", void 0);
__decorate([
    (0, typeorm_1.TreeParent)(),
    __metadata("design:type", Object)
], Cartella.prototype, "cartellaParent", void 0);
__decorate([
    (0, typeorm_1.TreeChildren)(),
    __metadata("design:type", Array)
], Cartella.prototype, "sottoCartelle", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => documento_entity_1.Documento, (documento) => documento.cartella),
    __metadata("design:type", Array)
], Cartella.prototype, "documenti", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Cartella.prototype, "attivo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Cartella.prototype, "dataCreazione", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Cartella.prototype, "dataAggiornamento", void 0);
exports.Cartella = Cartella = __decorate([
    (0, typeorm_1.Entity)('cartelle'),
    (0, typeorm_1.Tree)('closure-table')
], Cartella);
//# sourceMappingURL=cartella.entity.js.map