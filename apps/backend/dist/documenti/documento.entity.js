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
exports.Documento = void 0;
const typeorm_1 = require("typeorm");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const cartella_entity_1 = require("../cartelle/cartella.entity");
const studio_entity_1 = require("../studi/studio.entity");
let Documento = class Documento {
    id;
    studioId;
    studio;
    nome;
    descrizione;
    percorsoFile;
    nomeOriginale;
    estensione;
    tipo;
    dimensione;
    caricatoDa;
    praticaId;
    pratica;
    cartellaId;
    cartella;
    attivo;
    dataCreazione;
    dataAggiornamento;
};
exports.Documento = Documento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Documento.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Documento.prototype, "studioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => studio_entity_1.Studio, (studio) => studio.documenti, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'studioId' }),
    __metadata("design:type", Object)
], Documento.prototype, "studio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Documento.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], Documento.prototype, "descrizione", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Documento.prototype, "percorsoFile", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Documento.prototype, "nomeOriginale", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Documento.prototype, "estensione", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['pdf', 'word', 'excel', 'immagine', 'csv', 'xml', 'altro'] }),
    __metadata("design:type", String)
], Documento.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Documento.prototype, "dimensione", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Documento.prototype, "caricatoDa", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Documento.prototype, "praticaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pratica_entity_1.Pratica, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'praticaId' }),
    __metadata("design:type", Object)
], Documento.prototype, "pratica", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Documento.prototype, "cartellaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cartella_entity_1.Cartella, (cartella) => cartella.documenti, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'cartellaId' }),
    __metadata("design:type", Object)
], Documento.prototype, "cartella", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Documento.prototype, "attivo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Documento.prototype, "dataCreazione", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Documento.prototype, "dataAggiornamento", void 0);
exports.Documento = Documento = __decorate([
    (0, typeorm_1.Entity)('documenti')
], Documento);
//# sourceMappingURL=documento.entity.js.map