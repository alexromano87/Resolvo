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
exports.Debitore = void 0;
const typeorm_1 = require("typeorm");
const cliente_debitore_entity_1 = require("../relazioni/cliente-debitore.entity");
const studio_entity_1 = require("../studi/studio.entity");
let Debitore = class Debitore {
    id;
    attivo;
    studioId;
    studio;
    tipoSoggetto;
    nome;
    cognome;
    codiceFiscale;
    dataNascita;
    luogoNascita;
    ragioneSociale;
    partitaIva;
    tipologia;
    sedeLegale;
    sedeOperativa;
    indirizzo;
    cap;
    citta;
    provincia;
    nazione;
    referente;
    telefono;
    email;
    pec;
    clientiDebitori;
    createdAt;
    updatedAt;
};
exports.Debitore = Debitore;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Debitore.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Debitore.prototype, "attivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Debitore.prototype, "studioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => studio_entity_1.Studio, (studio) => studio.debitori, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'studioId' }),
    __metadata("design:type", Object)
], Debitore.prototype, "studio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Debitore.prototype, "tipoSoggetto", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Debitore.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Debitore.prototype, "cognome", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 16 }),
    __metadata("design:type", String)
], Debitore.prototype, "codiceFiscale", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Debitore.prototype, "dataNascita", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Debitore.prototype, "luogoNascita", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Debitore.prototype, "ragioneSociale", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 11 }),
    __metadata("design:type", String)
], Debitore.prototype, "partitaIva", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Debitore.prototype, "tipologia", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Debitore.prototype, "sedeLegale", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Debitore.prototype, "sedeOperativa", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Debitore.prototype, "indirizzo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 10 }),
    __metadata("design:type", String)
], Debitore.prototype, "cap", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Debitore.prototype, "citta", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 2 }),
    __metadata("design:type", String)
], Debitore.prototype, "provincia", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 2 }),
    __metadata("design:type", String)
], Debitore.prototype, "nazione", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Debitore.prototype, "referente", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Debitore.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Debitore.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Debitore.prototype, "pec", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cliente_debitore_entity_1.ClienteDebitore, (cd) => cd.debitore),
    __metadata("design:type", Array)
], Debitore.prototype, "clientiDebitori", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Debitore.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Debitore.prototype, "updatedAt", void 0);
exports.Debitore = Debitore = __decorate([
    (0, typeorm_1.Entity)('debitori')
], Debitore);
//# sourceMappingURL=debitore.entity.js.map