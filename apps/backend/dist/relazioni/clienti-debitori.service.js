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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientiDebitoriService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cliente_debitore_entity_1 = require("./cliente-debitore.entity");
const debitore_entity_1 = require("../debitori/debitore.entity");
let ClientiDebitoriService = class ClientiDebitoriService {
    cdRepo;
    debitoriRepo;
    constructor(cdRepo, debitoriRepo) {
        this.cdRepo = cdRepo;
        this.debitoriRepo = debitoriRepo;
    }
    async getDebitoriByCliente(clienteId, includeInactive = false) {
        const links = await this.cdRepo.find({
            where: { clienteId, attivo: true },
            relations: ['debitore'],
        });
        const debitori = links.map((l) => l.debitore);
        if (includeInactive) {
            return debitori;
        }
        return debitori.filter((d) => d.attivo !== false);
    }
    async linkDebitoreToCliente(clienteId, debitoreId) {
        const existing = await this.cdRepo.findOne({
            where: { clienteId, debitoreId },
        });
        if (existing) {
            if (!existing.attivo) {
                existing.attivo = true;
                await this.cdRepo.save(existing);
            }
        }
        else {
            const link = this.cdRepo.create({
                clienteId,
                debitoreId,
                attivo: true,
            });
            await this.cdRepo.save(link);
        }
    }
    async setDebitoriForCliente(clienteId, debitoriIds) {
        await this.cdRepo.update({ clienteId }, { attivo: false });
        if (!debitoriIds || debitoriIds.length === 0) {
            return;
        }
        const existing = await this.cdRepo.find({
            where: { clienteId, debitoreId: (0, typeorm_2.In)(debitoriIds) },
        });
        const existingMap = new Map(existing.map((l) => [l.debitoreId, l]));
        const toSave = [];
        for (const debitoreId of debitoriIds) {
            const found = existingMap.get(debitoreId);
            if (found) {
                found.attivo = true;
                toSave.push(found);
            }
            else {
                toSave.push(this.cdRepo.create({
                    clienteId,
                    debitoreId,
                    attivo: true,
                }));
            }
        }
        await this.cdRepo.save(toSave);
    }
    async unlinkDebitoreFromCliente(clienteId, debitoreId) {
        await this.cdRepo.update({ clienteId, debitoreId }, { attivo: false });
    }
    async getClientiByDebitore(debitoreId) {
        const links = await this.cdRepo.find({
            where: { debitoreId, attivo: true },
        });
        return links.map((l) => l.clienteId);
    }
};
exports.ClientiDebitoriService = ClientiDebitoriService;
exports.ClientiDebitoriService = ClientiDebitoriService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cliente_debitore_entity_1.ClienteDebitore)),
    __param(1, (0, typeorm_1.InjectRepository)(debitore_entity_1.Debitore)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ClientiDebitoriService);
//# sourceMappingURL=clienti-debitori.service.js.map