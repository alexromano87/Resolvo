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
exports.ClientiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cliente_entity_1 = require("./cliente.entity");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const pagination_1 = require("../common/pagination");
let ClientiService = class ClientiService {
    repo;
    praticheRepo;
    avvocatiRepo;
    constructor(repo, praticheRepo, avvocatiRepo) {
        this.repo = repo;
        this.praticheRepo = praticheRepo;
        this.avvocatiRepo = avvocatiRepo;
    }
    async create(data) {
        if (data.partitaIva) {
            const existing = await this.repo.findOne({
                where: { partitaIva: data.partitaIva },
            });
            if (existing) {
                throw new common_1.ConflictException('Esiste già un cliente con questa Partita IVA');
            }
        }
        const cliente = this.repo.create(data);
        return this.repo.save(cliente);
    }
    async findAll(includeInactive = false, studioId, pagination) {
        const where = includeInactive ? {} : { attivo: true };
        if (studioId !== undefined) {
            where.studioId = studioId;
        }
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        return this.repo.find({
            where,
            order: { ragioneSociale: 'ASC' },
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
            const where = { id: user.clienteId };
            if (!includeInactive) {
                where.attivo = true;
            }
            const cliente = await this.repo.findOne({ where });
            return cliente ? [cliente] : [];
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
        const query = this.repo.createQueryBuilder('cliente');
        query.leftJoin(pratica_entity_1.Pratica, 'pratica', 'pratica.clienteId = cliente.id');
        if (!includeInactive) {
            query.andWhere('cliente.attivo = :attivo', { attivo: true });
            query.andWhere('pratica.attivo = :praticaAttiva', { praticaAttiva: true });
        }
        if (user.studioId) {
            query.andWhere('cliente.studioId = :studioId', { studioId: user.studioId });
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
        query.orderBy('cliente.ragioneSociale', 'ASC');
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        return query.getMany();
    }
    async findOne(id) {
        const cliente = await this.repo.findOne({
            where: { id },
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente con ID ${id} non trovato`);
        }
        return cliente;
    }
    async update(id, data) {
        const cliente = await this.findOne(id);
        if (data.partitaIva && data.partitaIva !== cliente.partitaIva) {
            const existing = await this.repo.findOne({
                where: { partitaIva: data.partitaIva },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Esiste già un cliente con questa Partita IVA');
            }
        }
        await this.repo.update({ id }, data);
        return this.findOne(id);
    }
    async deactivate(id) {
        const cliente = await this.findOne(id);
        const praticheAperte = await this.praticheRepo.count({
            where: { clienteId: id, aperta: true, attivo: true },
        });
        if (praticheAperte > 0) {
            throw new common_1.ConflictException(`Impossibile disattivare: il cliente ha ${praticheAperte} pratiche aperte`);
        }
        await this.repo.update({ id }, { attivo: false });
        return { ...cliente, attivo: false };
    }
    async reactivate(id) {
        const cliente = await this.findOne(id);
        await this.repo.update({ id }, { attivo: true });
        return { ...cliente, attivo: true };
    }
    async remove(id) {
        const cliente = await this.findOne(id);
        const praticheCollegate = await this.praticheRepo.count({
            where: { clienteId: id },
        });
        if (praticheCollegate > 0) {
            throw new common_1.ConflictException(`Impossibile eliminare: il cliente è collegato a ${praticheCollegate} pratiche`);
        }
        await this.repo.delete({ id });
        return cliente;
    }
    async countPraticheCollegate(id) {
        return this.praticheRepo.count({ where: { clienteId: id } });
    }
    async canAccessCliente(user, clienteId) {
        if (user.ruolo === 'admin')
            return true;
        if (user.ruolo === 'cliente') {
            return Boolean(user.clienteId && user.clienteId === clienteId);
        }
        if (!user.studioId)
            return false;
        if (user.ruolo === 'avvocato') {
            const access = await this.getAvvocatoAccess(user.email, user.studioId);
            if (access === 'tutte') {
                const cliente = await this.findOne(clienteId);
                return cliente.studioId === user.studioId;
            }
            const email = user.email?.toLowerCase().trim();
            if (!email)
                return false;
            const count = await this.praticheRepo
                .createQueryBuilder('pratica')
                .leftJoin('pratica.avvocati', 'avvocato_access')
                .where('pratica.clienteId = :clienteId', { clienteId })
                .andWhere('pratica.studioId = :studioId', { studioId: user.studioId })
                .andWhere('LOWER(avvocato_access.email) = :email', { email })
                .getCount();
            return count > 0;
        }
        if (user.ruolo === 'collaboratore') {
            const count = await this.praticheRepo
                .createQueryBuilder('pratica')
                .leftJoin('pratica.collaboratori', 'collaboratore_access')
                .where('pratica.clienteId = :clienteId', { clienteId })
                .andWhere('pratica.studioId = :studioId', { studioId: user.studioId })
                .andWhere('collaboratore_access.id = :userId', { userId: user.id })
                .getCount();
            return count > 0;
        }
        const cliente = await this.findOne(clienteId);
        return cliente.studioId === user.studioId;
    }
    async getConfigurazioneCondivisione(id) {
        const cliente = await this.findOne(id);
        if (!cliente.configurazioneCondivisione) {
            return {
                abilitata: false,
                dashboard: {
                    stats: false,
                    kpi: false,
                },
                pratiche: {
                    elenco: false,
                    dettagli: false,
                    documenti: false,
                    movimentiFinanziari: false,
                    timeline: false,
                },
            };
        }
        return cliente.configurazioneCondivisione;
    }
    async updateConfigurazioneCondivisione(id, configurazione) {
        const cliente = await this.findOne(id);
        await this.repo.update({ id }, { configurazioneCondivisione: configurazione });
        return this.findOne(id);
    }
};
exports.ClientiService = ClientiService;
exports.ClientiService = ClientiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __param(1, (0, typeorm_1.InjectRepository)(pratica_entity_1.Pratica)),
    __param(2, (0, typeorm_1.InjectRepository)(avvocato_entity_1.Avvocato)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ClientiService);
//# sourceMappingURL=clienti.service.js.map