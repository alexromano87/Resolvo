import { Pratica } from '../pratiche/pratica.entity';
import { Studio } from '../studi/studio.entity';
export type AlertStato = 'in_gestione' | 'chiuso';
export type AlertDestinatario = 'studio' | 'cliente';
export type AlertModalitaNotifica = 'popup';
export interface MessaggioAlert {
    id: string;
    autore: string;
    testo: string;
    dataInvio: Date;
}
export declare class Alert {
    id: string;
    studioId: string | null;
    studio: Studio | null;
    praticaId: string;
    pratica: Pratica;
    titolo: string;
    descrizione: string;
    destinatario: AlertDestinatario;
    modalitaNotifica: AlertModalitaNotifica;
    clienteCanClose: boolean;
    dataScadenza: Date;
    giorniAnticipo: number;
    stato: AlertStato;
    messaggi: MessaggioAlert[];
    attivo: boolean;
    dataCreazione: Date;
    dataAggiornamento: Date;
    dataChiusura: Date | null;
}
