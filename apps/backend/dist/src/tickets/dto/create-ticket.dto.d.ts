import type { TicketPriorita, TicketCategoria } from '../ticket.entity';
export declare class CreateTicketDto {
    studioId?: string | null;
    praticaId?: string | null;
    oggetto: string;
    descrizione: string;
    autore: string;
    categoria?: TicketCategoria;
    priorita?: TicketPriorita;
}
