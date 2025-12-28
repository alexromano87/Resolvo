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
exports.DebitoriService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const debitore_entity_1 = require("./debitore.entity");
const clienti_debitori_service_1 = require("../relazioni/clienti-debitori.service");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const pagination_1 = require("../common/pagination");
let DebitoriService = class DebitoriService {
    repo;
    clientiDebitoriService;
    praticheRepo;
    avvocatiRepo;
    constructor(repo, clientiDebitoriService, praticheRepo, avvocatiRepo) {
        this.repo = repo;
        this.clientiDebitoriService = clientiDebitoriService;
        this.praticheRepo = praticheRepo;
        this.avvocatiRepo = avvocatiRepo;
    }
    async findAll(includeInactive = false, studioId, pagination) {
        const where = includeInactive ? {} : { attivo: true };
        if (studioId !== undefined) {
            where.studioId = studioId;
        }
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        return this.repo.find({
            where,
            order: { createdAt: 'DESC' },
            ...(page ? { skip: page.skip, take: page.take } : {}),
        });
    }
    async findAllForUser(user, includeInactive = false, pagination) {
        if (user.ruolo === 'admin') {
            return this.findAll(includeInactive, undefined, pagination);
        }
        if (user.ruolo === 'cliente') {
            if (!user.clienteId)
                return [];
            const praticaWhere = { clienteId: user.clienteId };
            if (!includeInactive) {
                praticaWhere.attivo = true;
            }
            const pratiche = await this.praticheRepo.find({ where: praticaWhere });
            const debitoreIds = Array.from(new Set(pratiche.map((p) => p.debitoreId)));
            if (debitoreIds.length === 0)
                return [];
            const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
            return this.repo.find({
                where: {
                    id: (0, typeorm_2.In)(debitoreIds),
                    ...(includeInactive ? {} : { attivo: true }),
                },
                order: { createdAt: 'DESC' },
                ...(page ? { skip: page.skip, take: page.take } : {}),
            });
        }
        if (!user.studioId)
            return [];
        if (user.ruolo === 'avvocato') {
            const access = await this.getAvvocatoAccess(user.email, user.studioId);
            if (access === 'tutte') {
                return this.findAll(includeInactive, user.studioId, pagination);
            }
        }
        if (user.ruolo === 'avvocato' || user.ruolo === 'collaboratore') {
            return this.findAllAssigned(user, includeInactive, pagination);
        }
        return this.findAll(includeInactive, user.studioId, pagination);
    }
    async findAllWithClientiCountForUser(user, includeInactive = false, pagination) {
        if (user.ruolo === 'admin') {
            return this.findAllWithClientiCount(includeInactive, undefined, pagination);
        }
        if (user.ruolo === 'cliente') {
            const debitori = await this.findAllForUser(user, includeInactive, pagination);
            const results = await Promise.all(debitori.map(async (d) => {
                const clientiIds = await this.clientiDebitoriService.getClientiByDebitore(d.id);
                return {
                    ...d,
                    clientiCount: clientiIds.length,
                };
            }));
            return results;
        }
        if (!user.studioId)
            return [];
        if (user.ruolo === 'avvocato') {
            const access = await this.getAvvocatoAccess(user.email, user.studioId);
            if (access === 'tutte') {
                return this.findAllWithClientiCount(includeInactive, user.studioId, pagination);
            }
        }
        if (user.ruolo === 'avvocato' || user.ruolo === 'collaboratore') {
            const debitori = await this.findAllAssigned(user, includeInactive, pagination);
            const results = await Promise.all(debitori.map(async (d) => {
                const clientiIds = await this.clientiDebitoriService.getClientiByDebitore(d.id);
                return {
                    ...d,
                    clientiCount: clientiIds.length,
                };
            }));
            return results;
        }
        return this.findAllWithClientiCount(includeInactive, user.studioId, pagination);
    }
    async getAvvocatoAccess(email, studioId) {
        const normalizedEmail = email?.toLowerCase().trim();
        if (!normalizedEmail || !studioId)
            return null;
        const avvocato = await this.avvocatiRepo.findOne({
            where: { email: normalizedEmail, studioId },
        });
        return avvocato?.livelloAccessoPratiche ?? null;
    }
    async findAllAssigned(user, includeInactive = false, pagination) {
        const query = this.repo.createQueryBuilder('debitore');
        query.leftJoin(pratica_entity_1.Pratica, 'pratica', 'pratica.debitoreId = debitore.id');
        if (!includeInactive) {
            query.andWhere('debitore.attivo = :attivo', { attivo: true });
            query.andWhere('pratica.attivo = :praticaAttiva', { praticaAttiva: true });
        }
        if (user.studioId) {
            query.andWhere('debitore.studioId = :studioId', { studioId: user.studioId });
        }
        if (user.ruolo === 'avvocato') {
            const email = user.email?.toLowerCase().trim();
            if (!email)
                return [];
            query.leftJoin('pratica.avvocati', 'avvocato_access');
            query.andWhere('LOWER(avvocato_access.email) = :email', { email });
        }
        else if (user.ruolo === 'collaboratore') {
            query.leftJoin('pratica.collaboratori', 'collaboratore_access');
            query.andWhere('collaboratore_access.id = :userId', { userId: user.id });
        }
        query.distinct(true);
        query.orderBy('debitore.createdAt', 'DESC');
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        return query.getMany();
    }
    async findAllWithClientiCount(includeInactive = false, studioId, pagination) {
        const where = includeInactive ? {} : { attivo: true };
        if (studioId !== undefined) {
            where.studioId = studioId;
        }
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        const debitori = await this.repo.find({
            where,
            order: { createdAt: 'DESC' },
            ...(page ? { skip: page.skip, take: page.take } : {}),
        });
        const results = await Promise.all(debitori.map(async (d) => {
            const clientiIds = await this.clientiDebitoriService.getClientiByDebitore(d.id);
            return {
                ...d,
                clientiCount: clientiIds.length,
            };
        }));
        return results;
    }
    async findOne(id) {
        const debitore = await this.repo.findOne({ where: { id } });
        if (!debitore) {
            throw new common_1.NotFoundException(`Debitore con ID ${id} non trovato`);
        }
        return debitore;
    }
    async create(dto) {
        const { clientiIds, ...rest } = dto;
        if (rest.codiceFiscale) {
            const existing = await this.repo.findOne({
                where: { codiceFiscale: rest.codiceFiscale },
            });
            if (existing) {
                throw new common_1.ConflictException('Esiste già un debitore con questo Codice Fiscale');
            }
        }
        const debitore = this.repo.create({
            ...rest,
            dataNascita: rest.dataNascita ? new Date(rest.dataNascita) : undefined,
        });
        const saved = await this.repo.save(debitore);
        if (clientiIds && clientiIds.length > 0) {
            for (const clienteId of clientiIds) {
                await this.clientiDebitoriService.linkDebitoreToCliente(clienteId, saved.id);
            }
        }
        return saved;
    }
    async update(id, dto) {
        const debitore = await this.findOne(id);
        const { clientiIds, ...rest } = dto;
        if (rest.codiceFiscale && rest.codiceFiscale !== debitore.codiceFiscale) {
            const existing = await this.repo.findOne({
                where: { codiceFiscale: rest.codiceFiscale },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Esiste già un debitore con questo Codice Fiscale');
            }
        }
        await this.repo.update({ id }, {
            ...rest,
            dataNascita: rest.dataNascita ? new Date(rest.dataNascita) : undefined,
        });
        return this.findOne(id);
    }
    async deactivate(id) {
        const debitore = await this.findOne(id);
        const praticheAperte = await this.praticheRepo.count({
            where: { debitoreId: id, aperta: true, attivo: true },
        });
        if (praticheAperte > 0) {
            throw new common_1.ConflictException(`Impossibile disattivare: il debitore ha ${praticheAperte} pratiche aperte`);
        }
        await this.repo.update({ id }, { attivo: false });
        return { ...debitore, attivo: false };
    }
    async reactivate(id) {
        const debitore = await this.findOne(id);
        await this.repo.update({ id }, { attivo: true });
        return { ...debitore, attivo: true };
    }
    async remove(id) {
        await this.findOne(id);
        const praticheCollegate = await this.praticheRepo.count({
            where: { debitoreId: id },
        });
        if (praticheCollegate > 0) {
            throw new common_1.ConflictException(`Impossibile eliminare: il debitore è collegato a ${praticheCollegate} pratiche`);
        }
        await this.repo.delete({ id });
    }
    async countPraticheCollegate(id) {
        return this.praticheRepo.count({ where: { debitoreId: id } });
    }
    async canAccessDebitore(user, debitoreId) {
        if (user.ruolo === 'admin')
            return true;
        if (user.ruolo === 'cliente') {
            if (!user.clienteId)
                return false;
            const count = await this.praticheRepo.count({
                where: { debitoreId, clienteId: user.clienteId },
            });
            return count > 0;
        }
        if (!user.studioId)
            return false;
        if (user.ruolo === 'avvocato') {
            const access = await this.getAvvocatoAccess(user.email, user.studioId);
            if (access === 'tutte') {
                const debitore = await this.findOne(debitoreId);
                return debitore.studioId === user.studioId;
            }
            const email = user.email?.toLowerCase().trim();
            if (!email)
                return false;
            const count = await this.praticheRepo
                .createQueryBuilder('pratica')
                .leftJoin('pratica.avvocati', 'avvocato_access')
                .where('pratica.debitoreId = :debitoreId', { debitoreId })
                .andWhere('pratica.studioId = :studioId', { studioId: user.studioId })
                .andWhere('LOWER(avvocato_access.email) = :email', { email })
                .getCount();
            return count > 0;
        }
        if (user.ruolo === 'collaboratore') {
            const count = await this.praticheRepo
                .createQueryBuilder('pratica')
                .leftJoin('pratica.collaboratori', 'collaboratore_access')
                .where('pratica.debitoreId = :debitoreId', { debitoreId })
                .andWhere('pratica.studioId = :studioId', { studioId: user.studioId })
                .andWhere('collaboratore_access.id = :userId', { userId: user.id })
                .getCount();
            return count > 0;
        }
        const debitore = await this.findOne(debitoreId);
        return debitore.studioId === user.studioId;
    }
};
exports.DebitoriService = DebitoriService;
exports.DebitoriService = DebitoriService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(debitore_entity_1.Debitore)),
    __param(2, (0, typeorm_1.InjectRepository)(pratica_entity_1.Pratica)),
    __param(3, (0, typeorm_1.InjectRepository)(avvocato_entity_1.Avvocato)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        clienti_debitori_service_1.ClientiDebitoriService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DebitoriService);
//# sourceMappingURL=debitori.service.js.map