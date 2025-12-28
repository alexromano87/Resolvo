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
exports.Alert = void 0;
const typeorm_1 = require("typeorm");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const studio_entity_1 = require("../studi/studio.entity");
let Alert = class Alert {
    id;
    studioId;
    studio;
    praticaId;
    pratica;
    titolo;
    descrizione;
    destinatario;
    modalitaNotifica;
    clienteCanClose;
    dataScadenza;
    giorniAnticipo;
    stato;
    messaggi;
    attivo;
    dataCreazione;
    dataAggiornamento;
    dataChiusura;
};
exports.Alert = Alert;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Alert.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Alert.prototype, "studioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => studio_entity_1.Studio, (studio) => studio.alerts, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'studioId' }),
    __metadata("design:type", Object)
], Alert.prototype, "studio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Alert.prototype, "praticaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pratica_entity_1.Pratica, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'praticaId' }),
    __metadata("design:type", pratica_entity_1.Pratica)
], Alert.prototype, "pratica", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Alert.prototype, "titolo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Alert.prototype, "descrizione", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['studio', 'cliente'] }),
    __metadata("design:type", String)
], Alert.prototype, "destinatario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['popup'], default: 'popup' }),
    __metadata("design:type", String)
], Alert.prototype, "modalitaNotifica", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Alert.prototype, "clienteCanClose", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Alert.prototype, "dataScadenza", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 3 }),
    __metadata("design:type", Number)
], Alert.prototype, "giorniAnticipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['in_gestione', 'chiuso'], default: 'in_gestione' }),
    __metadata("design:type", String)
], Alert.prototype, "stato", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Alert.prototype, "messaggi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Alert.prototype, "attivo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Alert.prototype, "dataCreazione", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Alert.prototype, "dataAggiornamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Alert.prototype, "dataChiusura", void 0);
exports.Alert = Alert = __decorate([
    (0, typeorm_1.Entity)('alerts')
], Alert);
//# sourceMappingURL=alert.entity.js.map