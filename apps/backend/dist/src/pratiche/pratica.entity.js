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
exports.Pratica = void 0;
const typeorm_1 = require("typeorm");
const cliente_entity_1 = require("../clienti/cliente.entity");
const debitore_entity_1 = require("../debitori/debitore.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const user_entity_1 = require("../users/user.entity");
const movimento_finanziario_entity_1 = require("../movimenti-finanziari/movimento-finanziario.entity");
const studio_entity_1 = require("../studi/studio.entity");
let Pratica = class Pratica {
    id;
    attivo;
    clienteId;
    cliente;
    studioId;
    studio;
    debitoreId;
    debitore;
    avvocati;
    collaboratori;
    movimentiFinanziari;
    faseId;
    aperta;
    esito;
    capitale;
    importoRecuperatoCapitale;
    anticipazioni;
    importoRecuperatoAnticipazioni;
    compensiLegali;
    compensiLiquidati;
    interessi;
    interessiRecuperati;
    note;
    riferimentoCredito;
    storico;
    opposizione;
    pignoramento;
    dataAffidamento;
    dataChiusura;
    dataScadenza;
    createdAt;
    updatedAt;
};
exports.Pratica = Pratica;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Pratica.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Pratica.prototype, "attivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Pratica.prototype, "clienteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'clienteId' }),
    __metadata("design:type", cliente_entity_1.Cliente)
], Pratica.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Pratica.prototype, "studioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => studio_entity_1.Studio, (studio) => studio.pratiche, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'studioId' }),
    __metadata("design:type", Object)
], Pratica.prototype, "studio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Pratica.prototype, "debitoreId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => debitore_entity_1.Debitore, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'debitoreId' }),
    __metadata("design:type", debitore_entity_1.Debitore)
], Pratica.prototype, "debitore", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => avvocato_entity_1.Avvocato, (avvocato) => avvocato.pratiche),
    (0, typeorm_1.JoinTable)({
        name: 'pratiche_avvocati',
        joinColumn: { name: 'praticaId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'avvocatoId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Pratica.prototype, "avvocati", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User),
    (0, typeorm_1.JoinTable)({
        name: 'pratiche_collaboratori',
        joinColumn: { name: 'praticaId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Pratica.prototype, "collaboratori", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => movimento_finanziario_entity_1.MovimentoFinanziario, (movimento) => movimento.pratica),
    __metadata("design:type", Array)
], Pratica.prototype, "movimentiFinanziari", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'fase-001' }),
    __metadata("design:type", String)
], Pratica.prototype, "faseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Pratica.prototype, "aperta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], Pratica.prototype, "esito", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pratica.prototype, "capitale", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pratica.prototype, "importoRecuperatoCapitale", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pratica.prototype, "anticipazioni", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pratica.prototype, "importoRecuperatoAnticipazioni", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pratica.prototype, "compensiLegali", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pratica.prototype, "compensiLiquidati", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pratica.prototype, "interessi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pratica.prototype, "interessiRecuperati", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Pratica.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Pratica.prototype, "riferimentoCredito", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Pratica.prototype, "storico", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Pratica.prototype, "opposizione", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Pratica.prototype, "pignoramento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Pratica.prototype, "dataAffidamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Pratica.prototype, "dataChiusura", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Pratica.prototype, "dataScadenza", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Pratica.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Pratica.prototype, "updatedAt", void 0);
exports.Pratica = Pratica = __decorate([
    (0, typeorm_1.Entity)('pratiche')
], Pratica);
//# sourceMappingURL=pratica.entity.js.map