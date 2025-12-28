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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ticket_entity_1 = require("./ticket.entity");
const uuid_1 = require("uuid");
const studio_entity_1 = require("../studi/studio.entity");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const email_service_1 = require("../notifications/email.service");
const notifications_service_1 = require("../notifications/notifications.service");
const alerts_service_1 = require("../alerts/alerts.service");
const pagination_1 = require("../common/pagination");
let TicketsService = class TicketsService {
    ticketRepository;
    praticaRepository;
    studioRepository;
    avvocatiRepository;
    emailService;
    notificationsService;
    alertsService;
    constructor(ticketRepository, praticaRepository, studioRepository, avvocatiRepository, emailService, notificationsService, alertsService) {
        this.ticketRepository = ticketRepository;
        this.praticaRepository = praticaRepository;
        this.studioRepository = studioRepository;
        this.avvocatiRepository = avvocatiRepository;
        this.emailService = emailService;
        this.notificationsService = notificationsService;
        this.alertsService = alertsService;
    }
    async create(createTicketDto) {
        const ticket = this.ticketRepository.create({
            ...createTicketDto,
            priorita: createTicketDto.priorita ?? 'normale',
            messaggi: [],
        });
        const saved = await this.ticketRepository.save(ticket);
        await this.sendTicketEmail(saved);
        const alert = await this.triggerTicketAlert(saved);
        if (alert) {
            saved.alertId = alert.id;
            await this.ticketRepository.save(saved);
        }
        return saved;
    }
    async createForUser(user, createTicketDto) {
        if (user.ruolo !== 'cliente') {
            throw new common_1.ForbiddenException('Solo il cliente può aprire un ticket');
        }
        if (!user.clienteId) {
            throw new common_1.ForbiddenException('Cliente non associato');
        }
        if (!createTicketDto.praticaId) {
            throw new common_1.BadRequestException('Pratica obbligatoria per aprire un ticket');
        }
        const pratica = await this.praticaRepository.findOne({
            where: { id: createTicketDto.praticaId },
        });
        if (!pratica || pratica.clienteId !== user.clienteId) {
            throw new common_1.ForbiddenException('Pratica non associata al cliente');
        }
        createTicketDto.studioId = pratica.studioId ?? createTicketDto.studioId ?? null;
        const saved = await this.create(createTicketDto);
        await this.notificationsService.notifyTicketOpened(saved);
        return saved;
    }
    async findAll(includeInactive = false, studioId, pagination) {
        const query = this.ticketRepository
            .createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.pratica', 'pratica')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('pratica.debitore', 'debitore')
            .orderBy('ticket.dataCreazione', 'DESC');
        if (!includeInactive) {
            query.andWhere('ticket.attivo = :attivo', { attivo: true });
        }
        if (studioId !== undefined) {
            query.andWhere('ticket.studioId = :studioId', { studioId });
        }
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        return query.getMany();
    }
    async findAllForUser(user, includeInactive = false, pagination) {
        const query = this.ticketRepository
            .createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.pratica', 'pratica')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('pratica.debitore', 'debitore')
            .orderBy('ticket.dataCreazione', 'DESC');
        if (!includeInactive) {
            query.andWhere('ticket.attivo = :attivo', { attivo: true });
        }
        await this.applyAccessFilter(query, user);
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        return query.getMany();
    }
    async findAllByPratica(praticaId, includeInactive = false, pagination) {
        const query = this.ticketRepository
            .createQueryBuilder('ticket')
            .where('ticket.praticaId = :praticaId', { praticaId })
            .leftJoinAndSelect('ticket.pratica', 'pratica')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('pratica.debitore', 'debitore')
            .orderBy('ticket.dataCreazione', 'DESC');
        if (!includeInactive) {
            query.andWhere('ticket.attivo = :attivo', { attivo: true });
        }
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        return query.getMany();
    }
    async findAllByPraticaForUser(praticaId, user, includeInactive = false, pagination) {
        const query = this.ticketRepository
            .createQueryBuilder('ticket')
            .where('ticket.praticaId = :praticaId', { praticaId })
            .leftJoinAndSelect('ticket.pratica', 'pratica')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('pratica.debitore', 'debitore')
            .orderBy('ticket.dataCreazione', 'DESC');
        if (!includeInactive) {
            query.andWhere('ticket.attivo = :attivo', { attivo: true });
        }
        await this.applyAccessFilter(query, user);
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        return query.getMany();
    }
    async findAllByStato(stato, includeInactive = false, pagination) {
        const query = this.ticketRepository
            .createQueryBuilder('ticket')
            .where('ticket.stato = :stato', { stato })
            .leftJoinAndSelect('ticket.pratica', 'pratica')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('pratica.debitore', 'debitore')
            .orderBy('ticket.dataCreazione', 'DESC');
        if (!includeInactive) {
            query.andWhere('ticket.attivo = :attivo', { attivo: true });
        }
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        return query.getMany();
    }
    async findAllByStatoForUser(stato, user, includeInactive = false, pagination) {
        const query = this.ticketRepository
            .createQueryBuilder('ticket')
            .where('ticket.stato = :stato', { stato })
            .leftJoinAndSelect('ticket.pratica', 'pratica')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('pratica.debitore', 'debitore')
            .orderBy('ticket.dataCreazione', 'DESC');
        if (!includeInactive) {
            query.andWhere('ticket.attivo = :attivo', { attivo: true });
        }
        await this.applyAccessFilter(query, user);
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        return query.getMany();
    }
    async findOne(id) {
        const ticket = await this.ticketRepository.findOne({
            where: { id },
            relations: ['pratica', 'pratica.cliente', 'pratica.debitore'],
        });
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket con ID ${id} non trovato`);
        }
        return ticket;
    }
    async findOneForUser(id, user) {
        const query = this.ticketRepository
            .createQueryBuilder('ticket')
            .where('ticket.id = :id', { id })
            .leftJoinAndSelect('ticket.pratica', 'pratica')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('pratica.debitore', 'debitore');
        await this.applyAccessFilter(query, user);
        const ticket = await query.getOne();
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket con ID ${id} non trovato`);
        }
        return ticket;
    }
    async update(id, updateTicketDto, user) {
        const ticket = user ? await this.findOneForUser(id, user) : await this.findOne(id);
        if (updateTicketDto.stato && !this.isValidStatusTransition(ticket.stato, updateTicketDto.stato)) {
            throw new common_1.BadRequestException(`Transizione stato non valida: ${ticket.stato} -> ${updateTicketDto.stato}`);
        }
        if (updateTicketDto.stato === 'chiuso' && ticket.stato !== 'chiuso') {
            Object.assign(ticket, updateTicketDto, { dataChiusura: new Date() });
        }
        else if (updateTicketDto.stato !== 'chiuso' && ticket.stato === 'chiuso') {
            Object.assign(ticket, updateTicketDto, { dataChiusura: null });
        }
        else {
            Object.assign(ticket, updateTicketDto);
        }
        return this.ticketRepository.save(ticket);
    }
    async deactivate(id, user) {
        const ticket = user ? await this.findOneForUser(id, user) : await this.findOne(id);
        ticket.attivo = false;
        return this.ticketRepository.save(ticket);
    }
    async reactivate(id, user) {
        const ticket = user ? await this.findOneForUser(id, user) : await this.findOne(id);
        ticket.attivo = true;
        return this.ticketRepository.save(ticket);
    }
    async remove(id, user) {
        const ticket = user ? await this.findOneForUser(id, user) : await this.findOne(id);
        await this.ticketRepository.remove(ticket);
    }
    async addMessaggio(id, addMessaggioDto, user) {
        const ticket = user ? await this.findOneForUser(id, user) : await this.findOne(id);
        const nuovoMessaggio = {
            id: (0, uuid_1.v4)(),
            autore: addMessaggioDto.autore,
            autoreNome: addMessaggioDto.autoreNome,
            testo: addMessaggioDto.testo,
            dataInvio: new Date(),
        };
        ticket.messaggi = [...(ticket.messaggi || []), nuovoMessaggio];
        const saved = await this.ticketRepository.save(ticket);
        await this.notificationsService.notifyTicketMessage(saved, addMessaggioDto.autore);
        return saved;
    }
    async chiudiTicket(id, user) {
        return this.update(id, { stato: 'chiuso' }, user);
    }
    async prendiInCarico(id, user) {
        return this.update(id, { stato: 'in_gestione' }, user);
    }
    async riapriTicket(id, user) {
        return this.update(id, { stato: 'in_gestione' }, user);
    }
    isValidStatusTransition(current, next) {
        if (current === next)
            return true;
        const allowed = {
            aperto: ['in_gestione'],
            in_gestione: ['chiuso'],
            chiuso: ['in_gestione'],
        };
        return allowed[current].includes(next);
    }
    async sendTicketEmail(ticket) {
        let studio = null;
        if (ticket.studioId) {
            studio = await this.studioRepository.findOne({ where: { id: ticket.studioId } });
        }
        if (!studio && ticket.praticaId) {
            const pratica = await this.praticaRepository.findOne({
                where: { id: ticket.praticaId },
                relations: ['studio'],
            });
            studio = pratica?.studio ?? null;
        }
        if (!studio?.email)
            return;
        const subject = `Nuovo ticket cliente: ${ticket.oggetto}`;
        const text = [
            `È stato aperto un nuovo ticket da un cliente.`,
            `Studio: ${studio.nome}`,
            `Oggetto: ${ticket.oggetto}`,
            `Autore: ${ticket.autore}`,
            `Categoria: ${ticket.categoria}`,
            `Priorità: ${ticket.priorita}`,
            `Descrizione: ${ticket.descrizione}`,
        ].join('\n');
        await this.emailService.sendEmail({
            to: studio.email,
            subject,
            text,
        });
    }
    async triggerTicketAlert(ticket) {
        if (!ticket.praticaId)
            return null;
        const alertPayload = {
            studioId: ticket.studioId ?? null,
            praticaId: ticket.praticaId,
            titolo: `Ticket cliente: ${ticket.oggetto}`,
            descrizione: ticket.descrizione,
            destinatario: 'studio',
            modalitaNotifica: 'popup',
            dataScadenza: new Date().toISOString(),
            giorniAnticipo: 0,
            clienteCanClose: true,
        };
        try {
            return await this.alertsService.create(alertPayload);
        }
        catch (error) {
            console.error('Errore creazione alert per ticket cliente', error);
            return null;
        }
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
                    query.andWhere('ticket.studioId = :studioId', { studioId: user.studioId });
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
        query.andWhere('ticket.studioId = :studioId', { studioId: user.studioId });
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
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __param(1, (0, typeorm_1.InjectRepository)(pratica_entity_1.Pratica)),
    __param(2, (0, typeorm_1.InjectRepository)(studio_entity_1.Studio)),
    __param(3, (0, typeorm_1.InjectRepository)(avvocato_entity_1.Avvocato)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService,
        notifications_service_1.NotificationsService,
        alerts_service_1.AlertsService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map