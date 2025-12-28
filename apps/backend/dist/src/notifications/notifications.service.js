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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./notification.entity");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const user_entity_1 = require("../users/user.entity");
let NotificationsService = class NotificationsService {
    notificationsRepo;
    usersRepo;
    praticheRepo;
    constructor(notificationsRepo, usersRepo, praticheRepo) {
        this.notificationsRepo = notificationsRepo;
        this.usersRepo = usersRepo;
        this.praticheRepo = praticheRepo;
    }
    async listForUser(userId, options) {
        const where = { userId };
        if (options?.unread) {
            where.readAt = null;
        }
        return this.notificationsRepo.find({
            where,
            relations: ['pratica', 'pratica.cliente', 'pratica.debitore'],
            order: { createdAt: 'DESC' },
            take: options?.limit,
        });
    }
    async markRead(userId, id) {
        await this.notificationsRepo.update({ id, userId }, { readAt: new Date() });
        return { success: true };
    }
    async markAllRead(userId) {
        await this.notificationsRepo.update({ userId, readAt: (0, typeorm_2.IsNull)() }, { readAt: new Date() });
        return { success: true };
    }
    async notifyStatusChanged(praticaId, faseNome) {
        const pratica = await this.findPraticaWithRelations(praticaId);
        if (!pratica)
            return;
        const message = faseNome ? `Cambio stato: ${faseNome}` : 'Stato pratica aggiornato';
        await this.createForPratica(pratica, {
            type: 'pratica_stato',
            title: 'Aggiornamento pratica',
            message,
            metadata: { faseId: pratica.faseId },
        });
    }
    async notifyDocumentAdded(documento) {
        if (!documento.praticaId)
            return;
        const pratica = await this.findPraticaWithRelations(documento.praticaId);
        if (!pratica)
            return;
        await this.createForPratica(pratica, {
            type: 'pratica_documento',
            title: 'Nuovo documento',
            message: `Nuovo documento: ${documento.nome}`,
            metadata: { documentoId: documento.id },
        });
    }
    async notifyTicketOpened(ticket) {
        if (!ticket.praticaId)
            return;
        const pratica = await this.findPraticaWithRelations(ticket.praticaId);
        if (!pratica)
            return;
        const praticaLabel = this.buildPraticaLabel(pratica);
        const baseRecipients = await this.getRecipients(pratica);
        const studioRecipients = pratica.studioId
            ? await this.usersRepo.find({
                where: {
                    studioId: pratica.studioId,
                    ruolo: (0, typeorm_2.In)(['segreteria', 'titolare_studio']),
                    attivo: true,
                },
            })
            : [];
        const unique = new Map();
        [...baseRecipients, ...studioRecipients].forEach((user) => unique.set(user.id, user));
        const recipients = Array.from(unique.values());
        if (recipients.length === 0)
            return;
        const notifications = recipients.map((user) => this.notificationsRepo.create({
            userId: user.id,
            praticaId: pratica.id,
            type: 'ticket_aperto',
            title: 'Nuovo ticket cliente',
            message: `${praticaLabel} • ${ticket.oggetto}`,
            metadata: { ticketId: ticket.id },
        }));
        await this.notificationsRepo.save(notifications);
    }
    async notifyTicketMessage(ticket, sender) {
        if (!ticket.praticaId)
            return;
        const pratica = await this.findPraticaWithRelations(ticket.praticaId);
        if (!pratica)
            return;
        if (sender === 'studio') {
            const referenteEmail = pratica.cliente?.referenteEmail?.toLowerCase().trim();
            const clienteWhere = [
                { ruolo: 'cliente', attivo: true, clienteId: pratica.clienteId },
                ...(referenteEmail
                    ? [{ ruolo: 'cliente', attivo: true, email: referenteEmail }]
                    : []),
            ];
            const clienteUsers = await this.usersRepo.find({
                where: clienteWhere,
            });
            const unique = new Map();
            clienteUsers.forEach((user) => unique.set(user.id, user));
            const recipients = Array.from(unique.values());
            if (recipients.length === 0)
                return;
            const notifications = recipients.map((user) => this.notificationsRepo.create({
                userId: user.id,
                praticaId: pratica.id,
                type: 'ticket_messaggio',
                title: 'Nuovo messaggio ticket',
                message: ticket.oggetto,
                metadata: { ticketId: ticket.id },
            }));
            await this.notificationsRepo.save(notifications);
            return;
        }
        const baseRecipients = await this.getRecipients(pratica);
        const studioRecipients = pratica.studioId
            ? await this.usersRepo.find({
                where: {
                    studioId: pratica.studioId,
                    ruolo: (0, typeorm_2.In)(['segreteria', 'titolare_studio']),
                    attivo: true,
                },
            })
            : [];
        const unique = new Map();
        [...baseRecipients, ...studioRecipients].forEach((user) => unique.set(user.id, user));
        const recipients = Array.from(unique.values());
        if (recipients.length === 0)
            return;
        const notifications = recipients.map((user) => this.notificationsRepo.create({
            userId: user.id,
            praticaId: pratica.id,
            type: 'ticket_messaggio',
            title: 'Nuovo messaggio cliente',
            message: ticket.oggetto,
            metadata: { ticketId: ticket.id },
        }));
        await this.notificationsRepo.save(notifications);
    }
    async findPraticaWithRelations(praticaId) {
        return this.praticheRepo.findOne({
            where: { id: praticaId },
            relations: ['avvocati', 'collaboratori', 'cliente', 'debitore'],
        });
    }
    async createForPratica(pratica, payload) {
        const recipients = await this.getRecipients(pratica);
        if (recipients.length === 0)
            return;
        const notifications = recipients.map((user) => this.notificationsRepo.create({
            userId: user.id,
            praticaId: pratica.id,
            type: payload.type,
            title: payload.title,
            message: payload.message,
            metadata: payload.metadata ?? null,
        }));
        await this.notificationsRepo.save(notifications);
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
    async getRecipients(pratica) {
        const collaboratorUsers = pratica.collaboratori?.filter((user) => user.attivo) ?? [];
        const avvocatoEmails = (pratica.avvocati || [])
            .map((avvocato) => avvocato.email?.toLowerCase().trim())
            .filter((email) => Boolean(email));
        let avvocatoUsers = [];
        if (avvocatoEmails.length > 0) {
            avvocatoUsers = await this.usersRepo.find({
                where: {
                    email: (0, typeorm_2.In)(avvocatoEmails),
                    ruolo: 'avvocato',
                    attivo: true,
                },
            });
        }
        const unique = new Map();
        [...collaboratorUsers, ...avvocatoUsers].forEach((user) => unique.set(user.id, user));
        return Array.from(unique.values());
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(pratica_entity_1.Pratica)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map