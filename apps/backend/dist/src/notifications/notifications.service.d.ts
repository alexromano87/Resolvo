import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { Pratica } from '../pratiche/pratica.entity';
import { User } from '../users/user.entity';
import { Documento } from '../documenti/documento.entity';
import { Ticket } from '../tickets/ticket.entity';
export declare class NotificationsService {
    private readonly notificationsRepo;
    private readonly usersRepo;
    private readonly praticheRepo;
    constructor(notificationsRepo: Repository<Notification>, usersRepo: Repository<User>, praticheRepo: Repository<Pratica>);
    listForUser(userId: string, options?: {
        unread?: boolean;
        limit?: number;
    }): Promise<Notification[]>;
    markRead(userId: string, id: string): Promise<{
        success: boolean;
    }>;
    markAllRead(userId: string): Promise<{
        success: boolean;
    }>;
    notifyStatusChanged(praticaId: string, faseNome?: string): Promise<void>;
    notifyDocumentAdded(documento: Documento): Promise<void>;
    notifyTicketOpened(ticket: Ticket): Promise<void>;
    notifyTicketMessage(ticket: Ticket, sender: 'studio' | 'cliente'): Promise<void>;
    private findPraticaWithRelations;
    private createForPratica;
    private buildPraticaLabel;
    private getRecipients;
}
