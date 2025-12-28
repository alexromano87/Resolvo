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
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const alert_entity_1 = require("./alert.entity");
const uuid_1 = require("uuid");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const email_service_1 = require("../notifications/email.service");
const pagination_1 = require("../common/pagination");
let AlertsService = class AlertsService {
    alertRepository;
    praticaRepository;
    avvocatiRepository;
    emailService;
    constructor(alertRepository, praticaRepository, avvocatiRepository, emailService) {
        this.alertRepository = alertRepository;
        this.praticaRepository = praticaRepository;
        this.avvocatiRepository = avvocatiRepository;
        this.emailService = emailService;
    }
    async create(createAlertDto) {
        const alert = this.alertRepository.create({
            ...createAlertDto,
            giorniAnticipo: createAlertDto.giorniAnticipo ?? 3,
            clienteCanClose: createAlertDto.clienteCanClose ?? false,
            messaggi: [],
        });
        const saved = await this.alertRepository.save(alert);
        await this.sendAlertEmail(saved);
        return saved;
    }
    async findAll(includeInactive = false, studioId, pagination) {
        const query = this.alertRepository
            .createQueryBuilder('alert')
            .leftJoinAndSelect('alert.pratica', 'pratica')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('pratica.debitore', 'debitore')
            .orderBy('alert.dataScadenza', 'ASC');
        if (!includeInactive) {
            query.andWhere('alert.attivo = :attivo', { attivo: true });
        }
        if (studioId !== undefined) {
            query.andWhere('alert.studioId = :studioId', { studioId });
        }
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        return query.getMany();
    }
    async findAllForUser(user, includeInactive = false, pagination) {
        const query = this.alertRepository
            .createQueryBuilder('alert')
            .leftJoinAndSelect('alert.pratica', 'pratica')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('pratica.debitore', 'debitore')
            .orderBy('alert.dataScadenza', 'ASC');
        if (!includeInactive) {
            query.andWhere('alert.attivo = :attivo', { attivo: true });
        }
        await this.applyAccessFilter(query, user);
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        return query.getMany();
    }
    async findAllByPratica(praticaId, includeInactive = false, pagination) {
        const query = this.alertRepository
            .createQueryBuilder('alert')
            .where('alert.praticaId = :praticaId', { praticaId })
            .leftJoinAndSelect('alert.pratica', 'pratica')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('pratica.debitore', 'debitore')
            .orderBy('alert.dataScadenza', 'ASC');
        if (!includeInactive) {
            query.andWhere('alert.attivo = :attivo', { attivo: true });
        }
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        return query.getMany();
    }
    async findAllByPraticaForUser(praticaId, user, includeInactive = false, pagination) {
        const query = this.alertRepository
            .createQueryBuilder('alert')
            .where('alert.praticaId = :praticaId', { praticaId })
            .leftJoinAndSelect('alert.pratica', 'pratica')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('pratica.debitore', 'debitore')
            .orderBy('alert.dataScadenza', 'ASC');
        if (!includeInactive) {
            query.andWhere('alert.attivo = :attivo', { attivo: true });
        }
        await this.applyAccessFilter(query, user);
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        return query.getMany();
    }
    async findAllByStato(stato, includeInactive = false, studioId, pagination) {
        const query = this.alertRepository
            .createQueryBuilder('alert')
            .where('alert.stato = :stato', { stato })
            .leftJoinAndSelect('alert.pratica', 'pratica')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('pratica.debitore', 'debitore')
            .orderBy('alert.dataScadenza', 'ASC');
        if (!includeInactive) {
            query.andWhere('alert.attivo = :attivo', { attivo: true });
        }
        if (studioId !== undefined) {
            query.andWhere('alert.studioId = :studioId', { studioId });
        }
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        return query.getMany();
    }
    async findAllByStatoForUser(stato, user, includeInactive = false, pagination) {
        const query = this.alertRepository
            .createQueryBuilder('alert')
            .where('alert.stato = :stato', { stato })
            .leftJoinAndSelect('alert.pratica', 'pratica')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('pratica.debitore', 'debitore')
            .orderBy('alert.dataScadenza', 'ASC');
        if (!includeInactive) {
            query.andWhere('alert.attivo = :attivo', { attivo: true });
        }
        await this.applyAccessFilter(query, user);
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        return query.getMany();
    }
    async findOne(id) {
        const alert = await this.alertRepository.findOne({
            where: { id },
            relations: ['pratica', 'pratica.cliente', 'pratica.debitore'],
        });
        if (!alert) {
            throw new common_1.NotFoundException(`Alert con ID ${id} non trovato`);
        }
        return alert;
    }
    async findOneForUser(id, user) {
        const query = this.alertRepository
            .createQueryBuilder('alert')
            .where('alert.id = :id', { id })
            .leftJoinAndSelect('alert.pratica', 'pratica')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('pratica.debitore', 'debitore');
        await this.applyAccessFilter(query, user);
        const alert = await query.getOne();
        if (!alert) {
            throw new common_1.NotFoundException(`Alert con ID ${id} non trovato`);
        }
        return alert;
    }
    async update(id, updateAlertDto, user) {
        const alert = user ? await this.findOneForUser(id, user) : await this.findOne(id);
        if (updateAlertDto.stato &&
            user?.ruolo === 'cliente' &&
            !alert.clienteCanClose) {
            throw new common_1.ForbiddenException('Solo lo studio legale può modificare lo stato degli alert');
        }
        if (updateAlertDto.stato && !this.isValidStatusTransition(alert.stato, updateAlertDto.stato)) {
            throw new common_1.BadRequestException(`Transizione stato non valida: ${alert.stato} -> ${updateAlertDto.stato}`);
        }
        if (updateAlertDto.stato === 'chiuso' && alert.stato !== 'chiuso') {
            Object.assign(alert, updateAlertDto, { dataChiusura: new Date() });
        }
        else if (updateAlertDto.stato === 'in_gestione' && alert.stato === 'chiuso') {
            Object.assign(alert, updateAlertDto, { dataChiusura: null });
        }
        else {
            Object.assign(alert, updateAlertDto);
        }
        return this.alertRepository.save(alert);
    }
    async deactivate(id, user) {
        const alert = user ? await this.findOneForUser(id, user) : await this.findOne(id);
        alert.attivo = false;
        return this.alertRepository.save(alert);
    }
    async reactivate(id, user) {
        const alert = user ? await this.findOneForUser(id, user) : await this.findOne(id);
        alert.attivo = true;
        return this.alertRepository.save(alert);
    }
    async remove(id, user) {
        const alert = user ? await this.findOneForUser(id, user) : await this.findOne(id);
        await this.alertRepository.remove(alert);
    }
    async addMessaggio(id, addMessaggioDto, user) {
        const alert = user ? await this.findOneForUser(id, user) : await this.findOne(id);
        const nuovoMessaggio = {
            id: (0, uuid_1.v4)(),
            autore: addMessaggioDto.autore,
            testo: addMessaggioDto.testo,
            dataInvio: new Date(),
        };
        alert.messaggi = [...(alert.messaggi || []), nuovoMessaggio];
        return this.alertRepository.save(alert);
    }
    async chiudiAlert(id) {
        return this.update(id, { stato: 'chiuso' });
    }
    async riapriAlert(id) {
        return this.update(id, { stato: 'in_gestione' });
    }
    isValidStatusTransition(current, next) {
        if (current === next)
            return true;
        const allowed = {
            in_gestione: ['chiuso'],
            chiuso: ['in_gestione'],
        };
        return allowed[current].includes(next);
    }
    buildPraticaLabel(pratica) {
        if (!pratica)
            return 'Pratica';
        const cliente = pratica.cliente?.ragioneSociale || 'Cliente';
        const debitore = pratica.debitore?.ragioneSociale ||
            [pratica.debitore?.nome, pratica.debitore?.cognome].filter(Boolean).join(' ') ||
            'Debitore';
        return `${cliente} vs ${debitore}`;
    }
    async sendAlertEmail(alert) {
        const pratica = await this.praticaRepository.findOne({
            where: { id: alert.praticaId },
            relations: ['avvocati', 'cliente', 'debitore'],
        });
        const recipients = Array.from(new Set((pratica?.avvocati || [])
            .map((avvocato) => avvocato.email)
            .filter(Boolean)));
        if (recipients.length === 0)
            return;
        const praticaLabel = this.buildPraticaLabel(pratica || null);
        const subject = `Nuovo alert per ${praticaLabel}`;
        const text = [
            `È stato creato un nuovo alert.`,
            `Pratica: ${praticaLabel}`,
            `Titolo: ${alert.titolo}`,
            `Descrizione: ${alert.descrizione}`,
            `Scadenza: ${new Date(alert.dataScadenza).toLocaleDateString('it-IT')}`,
        ].join('\n');
        await this.emailService.sendEmail({
            to: recipients,
            subject,
            text,
        });
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
                    query.andWhere('alert.studioId = :studioId', { studioId: user.studioId });
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
            query
                .leftJoin('pratica.avvocati', 'avvocato_access')
                .andWhere('LOWER(avvocato_access.email) = :email', { email });
            return;
        }
        if (user.ruolo === 'collaboratore') {
            query
                .leftJoin('pratica.collaboratori', 'collaboratore_access')
                .andWhere('collaboratore_access.id = :userId', { userId: user.id });
            return;
        }
        if (!user.studioId) {
            query.andWhere('1 = 0');
            return;
        }
        query.andWhere('alert.studioId = :studioId', { studioId: user.studioId });
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
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(alert_entity_1.Alert)),
    __param(1, (0, typeorm_1.InjectRepository)(pratica_entity_1.Pratica)),
    __param(2, (0, typeorm_1.InjectRepository)(avvocato_entity_1.Avvocato)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map