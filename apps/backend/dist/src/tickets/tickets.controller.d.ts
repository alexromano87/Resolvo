import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AddMessaggioDto } from './dto/add-messaggio.dto';
import type { CurrentUserData } from '../auth/current-user.decorator';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(user: CurrentUserData, createTicketDto: CreateTicketDto): Promise<import("./ticket.entity").Ticket>;
    findAll(user: CurrentUserData, includeInactive?: boolean, page?: string, limit?: string): Promise<import("./ticket.entity").Ticket[]>;
    findAllByPratica(user: CurrentUserData, praticaId: string, includeInactive?: boolean, page?: string, limit?: string): Promise<import("./ticket.entity").Ticket[]>;
    findAllByStato(user: CurrentUserData, stato: 'aperto' | 'in_gestione' | 'chiuso', includeInactive?: boolean, page?: string, limit?: string): Promise<import("./ticket.entity").Ticket[]>;
    findOne(user: CurrentUserData, id: string): Promise<import("./ticket.entity").Ticket>;
    update(user: CurrentUserData, id: string, updateTicketDto: UpdateTicketDto): Promise<import("./ticket.entity").Ticket>;
    deactivate(user: CurrentUserData, id: string): Promise<import("./ticket.entity").Ticket>;
    reactivate(user: CurrentUserData, id: string): Promise<import("./ticket.entity").Ticket>;
    remove(user: CurrentUserData, id: string): Promise<void>;
    addMessaggio(user: CurrentUserData, id: string, addMessaggioDto: AddMessaggioDto): Promise<import("./ticket.entity").Ticket>;
    chiudiTicket(user: CurrentUserData, id: string): Promise<import("./ticket.entity").Ticket>;
    prendiInCarico(user: CurrentUserData, id: string): Promise<import("./ticket.entity").Ticket>;
    riapriTicket(user: CurrentUserData, id: string): Promise<import("./ticket.entity").Ticket>;
}
