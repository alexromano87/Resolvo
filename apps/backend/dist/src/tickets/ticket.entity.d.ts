import { Pratica } from '../pratiche/pratica.entity';
import { Studio } from '../studi/studio.entity';
export type TicketStato = 'aperto' | 'in_gestione' | 'chiuso';
export type TicketPriorita = 'bassa' | 'normale' | 'alta' | 'urgente';
export type TicketCategoria = 'richiesta_informazioni' | 'documentazione' | 'pagamenti' | 'segnalazione_problema' | 'altro';
export interface MessaggioTicket {
    id: string;
    autore: string;
    autoreNome?: string;
    testo: string;
    dataInvio: Date;
}
export declare class Ticket {
    id: string;
    numeroTicket: string;
    studioId: string | null;
    studio: Studio | null;
    alertId: string | null;
    praticaId: string | null;
    pratica: Pratica | null;
    oggetto: string;
    descrizione: string;
    autore: string;
    categoria: TicketCategoria;
    priorita: TicketPriorita;
    stato: TicketStato;
    messaggi: MessaggioTicket[];
    attivo: boolean;
    dataCreazione: Date;
    dataAggiornamento: Date;
    dataChiusura: Date | null;
}
