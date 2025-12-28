import type { AlertDestinatario, AlertModalitaNotifica } from '../alert.entity';
export declare class CreateAlertDto {
    studioId?: string | null;
    praticaId: string;
    titolo: string;
    descrizione: string;
    destinatario: AlertDestinatario;
    modalitaNotifica?: AlertModalitaNotifica;
    dataScadenza: string;
    giorniAnticipo?: number;
    clienteCanClose?: boolean;
}
