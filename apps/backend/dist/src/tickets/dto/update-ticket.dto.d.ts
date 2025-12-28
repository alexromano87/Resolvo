import type { TicketStato, TicketPriorita } from '../ticket.entity';
export declare class UpdateTicketDto {
    oggetto?: string;
    descrizione?: string;
    priorita?: TicketPriorita;
    stato?: TicketStato;
}
