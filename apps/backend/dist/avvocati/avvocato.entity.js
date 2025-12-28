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
exports.Avvocato = void 0;
const typeorm_1 = require("typeorm");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const studio_entity_1 = require("../studi/studio.entity");
let Avvocato = class Avvocato {
    id;
    attivo;
    studioId;
    studio;
    nome;
    cognome;
    codiceFiscale;
    email;
    telefono;
    livelloAccessoPratiche;
    livelloPermessi;
    note;
    pratiche;
    createdAt;
    updatedAt;
};
exports.Avvocato = Avvocato;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Avvocato.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Avvocato.prototype, "attivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Avvocato.prototype, "studioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => studio_entity_1.Studio, (studio) => studio.avvocati, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'studioId' }),
    __metadata("design:type", Object)
], Avvocato.prototype, "studio", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Avvocato.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Avvocato.prototype, "cognome", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16, nullable: true }),
    __metadata("design:type", String)
], Avvocato.prototype, "codiceFiscale", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Avvocato.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Avvocato.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'solo_proprie',
    }),
    __metadata("design:type", String)
], Avvocato.prototype, "livelloAccessoPratiche", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'modifica',
    }),
    __metadata("design:type", String)
], Avvocato.prototype, "livelloPermessi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Avvocato.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => pratica_entity_1.Pratica, (pratica) => pratica.avvocati),
    __metadata("design:type", Array)
], Avvocato.prototype, "pratiche", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Avvocato.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Avvocato.prototype, "updatedAt", void 0);
exports.Avvocato = Avvocato = __decorate([
    (0, typeorm_1.Entity)('avvocati')
], Avvocato);
//# sourceMappingURL=avvocato.entity.js.map