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
exports.Ticket = void 0;
const typeorm_1 = require("typeorm");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const studio_entity_1 = require("../studi/studio.entity");
let Ticket = class Ticket {
    id;
    numeroTicket;
    studioId;
    studio;
    alertId;
    praticaId;
    pratica;
    oggetto;
    descrizione;
    autore;
    categoria;
    priorita;
    stato;
    messaggi;
    attivo;
    dataCreazione;
    dataAggiornamento;
    dataChiusura;
};
exports.Ticket = Ticket;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Ticket.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', unique: true }),
    (0, typeorm_1.Generated)('uuid'),
    __metadata("design:type", String)
], Ticket.prototype, "numeroTicket", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Ticket.prototype, "studioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => studio_entity_1.Studio, (studio) => studio.tickets, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'studioId' }),
    __metadata("design:type", Object)
], Ticket.prototype, "studio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Ticket.prototype, "alertId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Ticket.prototype, "praticaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pratica_entity_1.Pratica, { eager: true, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'praticaId' }),
    __metadata("design:type", Object)
], Ticket.prototype, "pratica", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Ticket.prototype, "oggetto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Ticket.prototype, "descrizione", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Ticket.prototype, "autore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['richiesta_informazioni', 'documentazione', 'pagamenti', 'segnalazione_problema', 'altro'], default: 'richiesta_informazioni' }),
    __metadata("design:type", String)
], Ticket.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['bassa', 'normale', 'alta', 'urgente'], default: 'normale' }),
    __metadata("design:type", String)
], Ticket.prototype, "priorita", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['aperto', 'in_gestione', 'chiuso'], default: 'aperto' }),
    __metadata("design:type", String)
], Ticket.prototype, "stato", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Ticket.prototype, "messaggi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Ticket.prototype, "attivo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Ticket.prototype, "dataCreazione", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Ticket.prototype, "dataAggiornamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Ticket.prototype, "dataChiusura", void 0);
exports.Ticket = Ticket = __decorate([
    (0, typeorm_1.Entity)('tickets')
], Ticket);
//# sourceMappingURL=ticket.entity.js.map