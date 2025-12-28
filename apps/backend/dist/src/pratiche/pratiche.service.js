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
exports.PraticheService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pratica_entity_1 = require("./pratica.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const user_entity_1 = require("../users/user.entity");
const fasi_service_1 = require("../fasi/fasi.service");
const notifications_service_1 = require("../notifications/notifications.service");
const pagination_1 = require("../common/pagination");
let PraticheService = class PraticheService {
    repo;
    avvocatiRepo;
    usersRepo;
    fasiService;
    notificationsService;
    constructor(repo, avvocatiRepo, usersRepo, fasiService, notificationsService) {
        this.repo = repo;
        this.avvocatiRepo = avvocatiRepo;
        this.usersRepo = usersRepo;
        this.fasiService = fasiService;
        this.notificationsService = notificationsService;
    }
    async findAll(includeInactive = false, studioId, pagination) {
        const where = includeInactive ? {} : { attivo: true };
        if (studioId) {
            where.studioId = studioId;
        }
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        return this.repo.find({
            where,
            relations: ['cliente', 'debitore', 'avvocati', 'collaboratori', 'movimentiFinanziari', 'studio'],
            order: { createdAt: 'DESC' },
            ...(page ? { skip: page.skip, take: page.take } : {}),
        });
    }
    async findAllForUser(user, includeInactive = false, pagination) {
        const where = includeInactive ? {} : { attivo: true };
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (user.ruolo === 'admin') {
            return this.repo.find({
                where,
                relations: ['cliente', 'debitore', 'avvocati', 'collaboratori', 'movimentiFinanziari', 'studio'],
                order: { createdAt: 'DESC' },
                ...(page ? { skip: page.skip, take: page.take } : {}),
            });
        }
        if (user.ruolo === 'cliente') {
            if (!user.clienteId)
                return [];
            return this.repo.find({
                where: { ...where, clienteId: user.clienteId },
                relations: ['cliente', 'debitore', 'avvocati', 'collaboratori', 'movimentiFinanziari', 'studio'],
                order: { createdAt: 'DESC' },
                ...(page ? { skip: page.skip, take: page.take } : {}),
            });
        }
        if (!user.studioId)
            return [];
        const pratiche = await this.repo.find({
            where: { ...where, studioId: user.studioId },
            relations: ['cliente', 'debitore', 'avvocati', 'collaboratori', 'movimentiFinanziari', 'studio'],
            order: { createdAt: 'DESC' },
        });
        const filtered = this.filterByAssignment(pratiche, user);
        if (page) {
            return filtered.slice(page.skip, page.skip + page.take);
        }
        return filtered;
    }
    async findByCliente(clienteId, includeInactive = false, pagination) {
        const where = includeInactive
            ? { clienteId }
            : { clienteId, attivo: true };
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        return this.repo.find({
            where,
            relations: ['cliente', 'debitore', 'avvocati', 'collaboratori', 'movimentiFinanziari'],
            order: { createdAt: 'DESC' },
            ...(page ? { skip: page.skip, take: page.take } : {}),
        });
    }
    async findByClienteForUser(clienteId, user, includeInactive = false, pagination) {
        const where = includeInactive
            ? { clienteId }
            : { clienteId, attivo: true };
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (user.ruolo === 'admin') {
            return this.repo.find({
                where,
                relations: ['cliente', 'debitore', 'avvocati', 'collaboratori', 'movimentiFinanziari'],
                order: { createdAt: 'DESC' },
                ...(page ? { skip: page.skip, take: page.take } : {}),
            });
        }
        if (user.ruolo === 'cliente') {
            if (!user.clienteId || user.clienteId !== clienteId)
                return [];
            return this.repo.find({
                where,
                relations: ['cliente', 'debitore', 'avvocati', 'collaboratori', 'movimentiFinanziari'],
                order: { createdAt: 'DESC' },
                ...(page ? { skip: page.skip, take: page.take } : {}),
            });
        }
        if (!user.studioId)
            return [];
        const pratiche = await this.repo.find({
            where: { ...where, studioId: user.studioId },
            relations: ['cliente', 'debitore', 'avvocati', 'collaboratori', 'movimentiFinanziari'],
            order: { createdAt: 'DESC' },
        });
        if (user.ruolo === 'avvocato') {
            const canSeeAll = await this.canAvvocatoSeeAll(user);
            if (canSeeAll) {
                return pratiche;
            }
        }
        return this.filterByAssignment(pratiche, user);
    }
    async findByDebitore(debitoreId, includeInactive = false, pagination) {
        const where = includeInactive
            ? { debitoreId }
            : { debitoreId, attivo: true };
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        return this.repo.find({
            where,
            relations: ['cliente', 'debitore', 'avvocati', 'collaboratori', 'movimentiFinanziari'],
            order: { createdAt: 'DESC' },
            ...(page ? { skip: page.skip, take: page.take } : {}),
        });
    }
    async findByDebitoreForUser(debitoreId, user, includeInactive = false, pagination) {
        const where = includeInactive
            ? { debitoreId }
            : { debitoreId, attivo: true };
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (user.ruolo === 'admin') {
            return this.repo.find({
                where,
                relations: ['cliente', 'debitore', 'avvocati', 'collaboratori', 'movimentiFinanziari'],
                order: { createdAt: 'DESC' },
                ...(page ? { skip: page.skip, take: page.take } : {}),
            });
        }
        if (user.ruolo === 'cliente') {
            if (!user.clienteId)
                return [];
            return this.repo.find({
                where: { ...where, clienteId: user.clienteId },
                relations: ['cliente', 'debitore', 'avvocati', 'collaboratori', 'movimentiFinanziari'],
                order: { createdAt: 'DESC' },
                ...(page ? { skip: page.skip, take: page.take } : {}),
            });
        }
        if (!user.studioId)
            return [];
        const pratiche = await this.repo.find({
            where: { ...where, studioId: user.studioId },
            relations: ['cliente', 'debitore', 'avvocati', 'collaboratori', 'movimentiFinanziari'],
            order: { createdAt: 'DESC' },
        });
        if (user.ruolo === 'avvocato') {
            const canSeeAll = await this.canAvvocatoSeeAll(user);
            if (canSeeAll) {
                if (page) {
                    return pratiche.slice(page.skip, page.skip + page.take);
                }
                return pratiche;
            }
        }
        const filtered = this.filterByAssignment(pratiche, user);
        if (page) {
            return filtered.slice(page.skip, page.skip + page.take);
        }
        return filtered;
    }
    async findOne(id) {
        const pratica = await this.repo.findOne({
            where: { id },
            relations: ['cliente', 'debitore', 'avvocati', 'collaboratori', 'movimentiFinanziari'],
        });
        if (!pratica) {
            throw new common_1.NotFoundException(`Pratica con ID ${id} non trovata`);
        }
        return pratica;
    }
    async findOneForUser(id, user) {
        const pratica = await this.repo.findOne({
            where: { id },
            relations: ['cliente', 'debitore', 'avvocati', 'collaboratori', 'movimentiFinanziari', 'studio'],
        });
        if (!pratica) {
            throw new common_1.NotFoundException(`Pratica con ID ${id} non trovata`);
        }
        if (user.ruolo === 'admin')
            return pratica;
        if (user.ruolo === 'cliente') {
            if (user.clienteId && pratica.clienteId === user.clienteId)
                return pratica;
            throw new common_1.NotFoundException(`Pratica con ID ${id} non trovata`);
        }
        if (!user.studioId || pratica.studioId !== user.studioId) {
            throw new common_1.NotFoundException(`Pratica con ID ${id} non trovata`);
        }
        if (user.ruolo === 'avvocato') {
            const canSeeAll = await this.canAvvocatoSeeAll(user);
            if (canSeeAll) {
                return pratica;
            }
        }
        if (this.isUserAssignedToPratica(pratica, user)) {
            return pratica;
        }
        throw new common_1.NotFoundException(`Pratica con ID ${id} non trovata`);
    }
    filterByAssignment(pratiche, user) {
        if (user.ruolo === 'avvocato' || user.ruolo === 'collaboratore') {
            return pratiche.filter((pratica) => this.isUserAssignedToPratica(pratica, user));
        }
        return pratiche;
    }
    async canAvvocatoSeeAll(user) {
        if (user.ruolo !== 'avvocato')
            return false;
        const email = user.email?.toLowerCase().trim();
        if (!email || !user.studioId)
            return false;
        const avvocato = await this.avvocatiRepo.findOne({
            where: { email, studioId: user.studioId },
        });
        return avvocato?.livelloAccessoPratiche === 'tutte';
    }
    isUserAssignedToPratica(pratica, user) {
        if (user.ruolo === 'avvocato') {
            const userEmail = user.email?.toLowerCase().trim();
            if (!userEmail)
                return false;
            return pratica.avvocati?.some((avvocato) => avvocato.email?.toLowerCase().trim() === userEmail) ?? false;
        }
        if (user.ruolo === 'collaboratore') {
            return pratica.collaboratori?.some((collaboratore) => collaboratore.id === user.id) ?? false;
        }
        return true;
    }
    async canUserModifyPratica(user) {
        if (user.ruolo === 'admin' || user.ruolo === 'titolare_studio')
            return true;
        if (user.ruolo === 'collaboratore')
            return true;
        if (user.ruolo === 'segreteria' || user.ruolo === 'cliente')
            return false;
        if (user.ruolo !== 'avvocato')
            return false;
        const email = user.email?.toLowerCase().trim();
        if (!email || !user.studioId)
            return false;
        const avvocato = await this.avvocatiRepo.findOne({
            where: { email, studioId: user.studioId },
        });
        return avvocato?.livelloPermessi === 'modifica';
    }
    async create(dto) {
        let faseIniziale;
        if (dto.faseId) {
            faseIniziale = this.fasiService.findOne(dto.faseId);
        }
        else {
            const fasi = this.fasiService.findAll();
            faseIniziale = fasi.find((f) => !f.isFaseChiusura);
            if (!faseIniziale) {
                throw new common_1.BadRequestException('Nessuna fase disponibile.');
            }
        }
        const storico = [
            {
                faseId: faseIniziale.id,
                faseCodice: faseIniziale.codice,
                faseNome: faseIniziale.nome,
                dataInizio: new Date().toISOString(),
            },
        ];
        let avvocati = [];
        if (dto.avvocatiIds && dto.avvocatiIds.length > 0) {
            avvocati = await this.avvocatiRepo.find({
                where: { id: (0, typeorm_2.In)(dto.avvocatiIds) },
            });
            if (avvocati.length !== dto.avvocatiIds.length) {
                throw new common_1.BadRequestException('Uno o più avvocati non trovati');
            }
        }
        let collaboratori = [];
        if (dto.collaboratoriIds && dto.collaboratoriIds.length > 0) {
            collaboratori = await this.usersRepo.find({
                where: { id: (0, typeorm_2.In)(dto.collaboratoriIds), ruolo: 'collaboratore', attivo: true },
            });
            if (collaboratori.length !== dto.collaboratoriIds.length) {
                throw new common_1.BadRequestException('Uno o più collaboratori non trovati');
            }
        }
        const { avvocatiIds, collaboratoriIds, ...dtoWithoutRelations } = dto;
        const pratica = this.repo.create({
            ...dtoWithoutRelations,
            faseId: faseIniziale.id,
            aperta: dto.aperta !== undefined ? dto.aperta : true,
            storico,
            avvocati,
            collaboratori,
            dataAffidamento: dto.dataAffidamento
                ? new Date(dto.dataAffidamento)
                : new Date(),
            dataChiusura: dto.dataChiusura ? new Date(dto.dataChiusura) : undefined,
            dataScadenza: dto.dataScadenza ? new Date(dto.dataScadenza) : undefined,
        });
        const saved = await this.repo.save(pratica);
        return this.findOne(saved.id);
    }
    async update(id, dto) {
        const pratica = await this.findOne(id);
        if (dto.faseId && dto.faseId !== pratica.faseId) {
            throw new common_1.BadRequestException('Per cambiare fase usa l\'endpoint PATCH /pratiche/:id/fase');
        }
        if (dto.esito && dto.esito !== pratica.esito) {
            pratica.aperta = false;
            pratica.esito = dto.esito;
            pratica.dataChiusura = new Date();
        }
        if (dto.avvocatiIds !== undefined) {
            if (dto.avvocatiIds.length > 0) {
                const avvocati = await this.avvocatiRepo.find({
                    where: { id: (0, typeorm_2.In)(dto.avvocatiIds) },
                });
                if (avvocati.length !== dto.avvocatiIds.length) {
                    throw new common_1.BadRequestException('Uno o più avvocati non trovati');
                }
                pratica.avvocati = avvocati;
            }
            else {
                pratica.avvocati = [];
            }
        }
        if (dto.collaboratoriIds !== undefined) {
            if (dto.collaboratoriIds.length > 0) {
                const collaboratori = await this.usersRepo.find({
                    where: { id: (0, typeorm_2.In)(dto.collaboratoriIds), ruolo: 'collaboratore', attivo: true },
                });
                if (collaboratori.length !== dto.collaboratoriIds.length) {
                    throw new common_1.BadRequestException('Uno o più collaboratori non trovati');
                }
                pratica.collaboratori = collaboratori;
            }
            else {
                pratica.collaboratori = [];
            }
        }
        const { avvocatiIds, collaboratoriIds, ...dtoWithoutRelations } = dto;
        Object.assign(pratica, {
            ...dtoWithoutRelations,
            dataAffidamento: dto.dataAffidamento
                ? new Date(dto.dataAffidamento)
                : pratica.dataAffidamento,
            dataChiusura: dto.dataChiusura
                ? new Date(dto.dataChiusura)
                : pratica.dataChiusura,
            dataScadenza: dto.dataScadenza
                ? new Date(dto.dataScadenza)
                : pratica.dataScadenza,
        });
        await this.repo.save(pratica);
        return this.findOne(id);
    }
    async cambiaFase(id, dto) {
        const pratica = await this.findOne(id);
        const nuovaFase = this.fasiService.findOne(dto.nuovaFaseId);
        if (!pratica.aperta && !nuovaFase.isFaseChiusura) {
            throw new common_1.BadRequestException('Non puoi cambiare fase a una pratica chiusa. Riapri prima la pratica.');
        }
        if (pratica.faseId === dto.nuovaFaseId) {
            throw new common_1.BadRequestException(`La pratica è già nella fase "${nuovaFase.nome}"`);
        }
        const now = new Date().toISOString();
        const storico = pratica.storico || [];
        if (storico.length > 0) {
            const faseCorrente = storico[storico.length - 1];
            if (!faseCorrente.dataFine) {
                faseCorrente.dataFine = now;
            }
        }
        storico.push({
            faseId: nuovaFase.id,
            faseCodice: nuovaFase.codice,
            faseNome: nuovaFase.nome,
            dataInizio: now,
            note: dto.note,
        });
        pratica.faseId = nuovaFase.id;
        pratica.storico = storico;
        if (nuovaFase.isFaseChiusura) {
            pratica.aperta = false;
            pratica.dataChiusura = new Date();
            if (nuovaFase.codice === 'chiusura_positiva') {
                pratica.esito = 'positivo';
            }
            else if (nuovaFase.codice === 'chiusura_negativa') {
                pratica.esito = 'negativo';
            }
            else if (dto.esito) {
                pratica.esito = dto.esito;
            }
            else {
                throw new common_1.BadRequestException('Per chiudere la pratica devi specificare un esito (positivo/negativo)');
            }
        }
        await this.repo.save(pratica);
        return this.findOne(id);
    }
    async riapri(id, nuovaFaseId) {
        const pratica = await this.findOne(id);
        if (pratica.aperta) {
            throw new common_1.BadRequestException('La pratica è già aperta');
        }
        let nuovaFase;
        if (nuovaFaseId) {
            nuovaFase = this.fasiService.findOne(nuovaFaseId);
        }
        else {
            const fasi = await this.fasiService.findAll();
            nuovaFase = fasi.find((f) => !f.isFaseChiusura);
            if (!nuovaFase) {
                throw new common_1.BadRequestException('Nessuna fase disponibile');
            }
        }
        const now = new Date().toISOString();
        const storico = pratica.storico || [];
        if (storico.length > 0) {
            const faseCorrente = storico[storico.length - 1];
            if (!faseCorrente.dataFine) {
                faseCorrente.dataFine = now;
            }
        }
        storico.push({
            faseId: nuovaFase.id,
            faseCodice: nuovaFase.codice,
            faseNome: nuovaFase.nome,
            dataInizio: now,
            note: 'Pratica riaperta',
        });
        pratica.aperta = true;
        pratica.esito = null;
        pratica.faseId = nuovaFase.id;
        pratica.storico = storico;
        pratica.dataChiusura = undefined;
        await this.repo.save(pratica);
        return this.findOne(id);
    }
    async deactivate(id) {
        const pratica = await this.findOne(id);
        await this.repo.update({ id }, { attivo: false });
        return this.findOne(id);
    }
    async reactivate(id) {
        const pratica = await this.findOne(id);
        await this.repo.update({ id }, { attivo: true });
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        await this.repo.delete({ id });
    }
    async countByStato() {
        const [aperte, chiusePositive, chiuseNegative, totali] = await Promise.all([
            this.repo.count({ where: { aperta: true, attivo: true } }),
            this.repo.count({
                where: { aperta: false, esito: 'positivo', attivo: true },
            }),
            this.repo.count({
                where: { aperta: false, esito: 'negativo', attivo: true },
            }),
            this.repo.count({ where: { attivo: true } }),
        ]);
        return { aperte, chiusePositive, chiuseNegative, totali };
    }
    async calcolaTotaliFinanziari() {
        const result = await this.repo
            .createQueryBuilder('pratica')
            .select([
            'SUM(pratica.capitale) as capitaleAffidato',
            'SUM(pratica.importoRecuperatoCapitale) as capitaleRecuperato',
            'SUM(pratica.anticipazioni) as anticipazioni',
            'SUM(pratica.importoRecuperatoAnticipazioni) as anticipazioniRecuperate',
            'SUM(pratica.compensiLegali) as compensiMaturati',
            'SUM(pratica.compensiLiquidati) as compensiLiquidati',
        ])
            .where('pratica.attivo = :attivo', { attivo: true })
            .getRawOne();
        const capitaleAffidato = parseFloat(result.capitaleAffidato) || 0;
        const capitaleRecuperato = parseFloat(result.capitaleRecuperato) || 0;
        return {
            capitaleAffidato,
            capitaleRecuperato,
            capitaleDaRecuperare: capitaleAffidato - capitaleRecuperato,
            anticipazioni: parseFloat(result.anticipazioni) || 0,
            anticipazioniRecuperate: parseFloat(result.anticipazioniRecuperate) || 0,
            compensiMaturati: parseFloat(result.compensiMaturati) || 0,
            compensiLiquidati: parseFloat(result.compensiLiquidati) || 0,
        };
    }
    async countByFase() {
        const results = await this.repo
            .createQueryBuilder('pratica')
            .select('pratica.faseId', 'faseId')
            .addSelect('COUNT(*)', 'count')
            .where('pratica.attivo = :attivo', { attivo: true })
            .groupBy('pratica.faseId')
            .getRawMany();
        const counts = {};
        results.forEach((r) => {
            const fase = this.fasiService.findOne(r.faseId);
            if (fase) {
                counts[fase.codice] = parseInt(r.count, 10);
            }
        });
        return counts;
    }
};
exports.PraticheService = PraticheService;
exports.PraticheService = PraticheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pratica_entity_1.Pratica)),
    __param(1, (0, typeorm_1.InjectRepository)(avvocato_entity_1.Avvocato)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        fasi_service_1.FasiService,
        notifications_service_1.NotificationsService])
], PraticheService);
//# sourceMappingURL=pratiche.service.js.map