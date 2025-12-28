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
exports.Studio = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const cliente_entity_1 = require("../clienti/cliente.entity");
const debitore_entity_1 = require("../debitori/debitore.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const movimento_finanziario_entity_1 = require("../movimenti-finanziari/movimento-finanziario.entity");
const alert_entity_1 = require("../alerts/alert.entity");
const ticket_entity_1 = require("../tickets/ticket.entity");
const documento_entity_1 = require("../documenti/documento.entity");
const cartella_entity_1 = require("../cartelle/cartella.entity");
let Studio = class Studio {
    id;
    nome;
    ragioneSociale;
    partitaIva;
    codiceFiscale;
    indirizzo;
    citta;
    cap;
    provincia;
    telefono;
    email;
    pec;
    attivo;
    createdAt;
    updatedAt;
    users;
    pratiche;
    clienti;
    debitori;
    avvocati;
    movimentiFinanziari;
    alerts;
    tickets;
    documenti;
    cartelle;
};
exports.Studio = Studio;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Studio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Studio.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Studio.prototype, "ragioneSociale", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Studio.prototype, "partitaIva", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Studio.prototype, "codiceFiscale", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Studio.prototype, "indirizzo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Studio.prototype, "citta", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Studio.prototype, "cap", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Studio.prototype, "provincia", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Studio.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Studio.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Studio.prototype, "pec", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Studio.prototype, "attivo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Studio.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Studio.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.studio),
    __metadata("design:type", Array)
], Studio.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pratica_entity_1.Pratica, (pratica) => pratica.studio),
    __metadata("design:type", Array)
], Studio.prototype, "pratiche", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cliente_entity_1.Cliente, (cliente) => cliente.studio),
    __metadata("design:type", Array)
], Studio.prototype, "clienti", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => debitore_entity_1.Debitore, (debitore) => debitore.studio),
    __metadata("design:type", Array)
], Studio.prototype, "debitori", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => avvocato_entity_1.Avvocato, (avvocato) => avvocato.studio),
    __metadata("design:type", Array)
], Studio.prototype, "avvocati", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => movimento_finanziario_entity_1.MovimentoFinanziario, (movimento) => movimento.studio),
    __metadata("design:type", Array)
], Studio.prototype, "movimentiFinanziari", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => alert_entity_1.Alert, (alert) => alert.studio),
    __metadata("design:type", Array)
], Studio.prototype, "alerts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_1.Ticket, (ticket) => ticket.studio),
    __metadata("design:type", Array)
], Studio.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => documento_entity_1.Documento, (documento) => documento.studio),
    __metadata("design:type", Array)
], Studio.prototype, "documenti", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cartella_entity_1.Cartella, (cartella) => cartella.studio),
    __metadata("design:type", Array)
], Studio.prototype, "cartelle", void 0);
exports.Studio = Studio = __decorate([
    (0, typeorm_1.Entity)('studi')
], Studio);
//# sourceMappingURL=studio.entity.js.map