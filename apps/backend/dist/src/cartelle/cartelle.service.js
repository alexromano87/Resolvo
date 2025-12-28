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
exports.CartelleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cartella_entity_1 = require("./cartella.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const pagination_1 = require("../common/pagination");
let CartelleService = class CartelleService {
    cartelleRepository;
    avvocatiRepository;
    constructor(cartelleRepository, avvocatiRepository) {
        this.cartelleRepository = cartelleRepository;
        this.avvocatiRepository = avvocatiRepository;
    }
    async create(createDto) {
        const cartella = this.cartelleRepository.create({
            nome: createDto.nome,
            descrizione: createDto.descrizione,
            colore: createDto.colore,
            praticaId: createDto.praticaId,
            studioId: createDto.studioId,
        });
        if (createDto.cartellaParentId) {
            const parent = await this.findOne(createDto.cartellaParentId);
            cartella.cartellaParent = parent;
        }
        return this.cartelleRepository.save(cartella);
    }
    async findAll(includeInactive = false, studioId, pagination) {
        const where = includeInactive ? {} : { attivo: true };
        if (studioId !== undefined) {
            where.studioId = studioId;
        }
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        return this.cartelleRepository.find({
            where,
            relations: ['pratica', 'pratica.cliente', 'documenti'],
            order: { dataCreazione: 'DESC' },
            ...(page ? { skip: page.skip, take: page.take } : {}),
        });
    }
    async findAllForUser(user, includeInactive = false, pagination) {
        const query = this.cartelleRepository
            .createQueryBuilder('cartella')
            .leftJoinAndSelect('cartella.pratica', 'pratica')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('cartella.documenti', 'documenti')
            .orderBy('cartella.dataCreazione', 'DESC');
        if (!includeInactive) {
            query.andWhere('cartella.attivo = :attivo', { attivo: true });
        }
        await this.applyAccessFilter(query, user);
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        return query.getMany();
    }
    async findByPratica(praticaId, includeInactive = false, pagination) {
        const where = includeInactive
            ? { praticaId }
            : { praticaId, attivo: true };
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        return this.cartelleRepository.find({
            where,
            relations: ['documenti', 'sottoCartelle', 'pratica', 'pratica.cliente'],
            order: { dataCreazione: 'DESC' },
            ...(page ? { skip: page.skip, take: page.take } : {}),
        });
    }
    async findTree(praticaId) {
        const roots = await this.cartelleRepository.find({
            where: praticaId
                ? { praticaId, cartellaParent: null, attivo: true }
                : { cartellaParent: null, attivo: true },
            relations: ['documenti'],
        });
        const trees = await Promise.all(roots.map((root) => this.cartelleRepository.findDescendantsTree(root)));
        return trees;
    }
    async findOne(id) {
        const cartella = await this.cartelleRepository.findOne({
            where: { id },
            relations: ['pratica', 'documenti', 'cartellaParent', 'sottoCartelle'],
        });
        if (!cartella) {
            throw new common_1.NotFoundException(`Cartella con ID ${id} non trovata`);
        }
        return cartella;
    }
    async findDescendants(id) {
        const cartella = await this.findOne(id);
        return this.cartelleRepository.findDescendants(cartella);
    }
    async findAncestors(id) {
        const cartella = await this.findOne(id);
        return this.cartelleRepository.findAncestors(cartella);
    }
    async update(id, updateDto) {
        const cartella = await this.findOne(id);
        if (updateDto.nome)
            cartella.nome = updateDto.nome;
        if (updateDto.descrizione !== undefined)
            cartella.descrizione = updateDto.descrizione;
        if (updateDto.colore !== undefined)
            cartella.colore = updateDto.colore;
        if (updateDto.cartellaParentId !== undefined) {
            if (updateDto.cartellaParentId === null) {
                cartella.cartellaParent = null;
            }
            else {
                const parent = await this.findOne(updateDto.cartellaParentId);
                cartella.cartellaParent = parent;
            }
        }
        return this.cartelleRepository.save(cartella);
    }
    async deactivate(id) {
        const cartella = await this.findOne(id);
        cartella.attivo = false;
        return this.cartelleRepository.save(cartella);
    }
    async reactivate(id) {
        const cartella = await this.cartelleRepository.findOne({
            where: { id },
            relations: ['pratica', 'documenti'],
        });
        if (!cartella) {
            throw new common_1.NotFoundException(`Cartella con ID ${id} non trovata`);
        }
        cartella.attivo = true;
        return this.cartelleRepository.save(cartella);
    }
    async remove(id) {
        const cartella = await this.findOne(id);
        await this.cartelleRepository.remove(cartella);
    }
    async applyAccessFilter(query, user) {
        if (user.ruolo === 'admin') {
            return;
        }
        if (user.ruolo === 'cliente') {
            if (!user.clienteId) {
                query.andWhere('1 = 0');
                return;
            }
            query.andWhere('pratica.clienteId = :clienteId', { clienteId: user.clienteId });
            return;
        }
        if (user.ruolo === 'avvocato') {
            const canSeeAll = await this.canAvvocatoSeeAll(user);
            if (canSeeAll) {
                if (user.studioId) {
                    query.andWhere('cartella.studioId = :studioId', { studioId: user.studioId });
                    return;
                }
                query.andWhere('1 = 0');
                return;
            }
            const email = user.email?.toLowerCase().trim();
            if (!email) {
                query.andWhere('1 = 0');
                return;
            }
            query.andWhere('cartella.praticaId IS NOT NULL');
            query
                .leftJoin('pratica.avvocati', 'avvocato_access')
                .andWhere('LOWER(avvocato_access.email) = :email', { email });
            return;
        }
        if (user.ruolo === 'collaboratore') {
            query.andWhere('cartella.praticaId IS NOT NULL');
            query
                .leftJoin('pratica.collaboratori', 'collaboratore_access')
                .andWhere('collaboratore_access.id = :userId', { userId: user.id });
            return;
        }
        if (!user.studioId) {
            query.andWhere('1 = 0');
            return;
        }
        query.andWhere('cartella.studioId = :studioId', { studioId: user.studioId });
    }
    async canAvvocatoSeeAll(user) {
        if (user.ruolo !== 'avvocato')
            return false;
        const email = user.email?.toLowerCase().trim();
        if (!email || !user.studioId)
            return false;
        const avvocato = await this.avvocatiRepository.findOne({
            where: { email, studioId: user.studioId },
        });
        return avvocato?.livelloAccessoPratiche === 'tutte';
    }
};
exports.CartelleService = CartelleService;
exports.CartelleService = CartelleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cartella_entity_1.Cartella)),
    __param(1, (0, typeorm_1.InjectRepository)(avvocato_entity_1.Avvocato)),
    __metadata("design:paramtypes", [typeorm_2.TreeRepository,
        typeorm_2.Repository])
], CartelleService);
//# sourceMappingURL=cartelle.service.js.map