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
exports.ClienteDebitore = void 0;
const typeorm_1 = require("typeorm");
const cliente_entity_1 = require("../clienti/cliente.entity");
const debitore_entity_1 = require("../debitori/debitore.entity");
let ClienteDebitore = class ClienteDebitore {
    id;
    clienteId;
    debitoreId;
    cliente;
    debitore;
    attivo;
    createdAt;
};
exports.ClienteDebitore = ClienteDebitore;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ClienteDebitore.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ClienteDebitore.prototype, "clienteId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ClienteDebitore.prototype, "debitoreId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente, (cliente) => cliente.clientiDebitori, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'clienteId' }),
    __metadata("design:type", cliente_entity_1.Cliente)
], ClienteDebitore.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => debitore_entity_1.Debitore, (debitore) => debitore.clientiDebitori, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'debitoreId' }),
    __metadata("design:type", debitore_entity_1.Debitore)
], ClienteDebitore.prototype, "debitore", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ClienteDebitore.prototype, "attivo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ClienteDebitore.prototype, "createdAt", void 0);
exports.ClienteDebitore = ClienteDebitore = __decorate([
    (0, typeorm_1.Entity)('clienti_debitori')
], ClienteDebitore);
//# sourceMappingURL=cliente-debitore.entity.js.map