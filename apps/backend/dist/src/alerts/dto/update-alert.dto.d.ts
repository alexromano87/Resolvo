import type { AlertStato, AlertDestinatario, AlertModalitaNotifica } from '../alert.entity';
export declare class UpdateAlertDto {
    titolo?: string;
    descrizione?: string;
    destinatario?: AlertDestinatario;
    modalitaNotifica?: AlertModalitaNotifica;
    dataScadenza?: string;
    giorniAnticipo?: number;
    stato?: AlertStato;
    clienteCanClose?: boolean;
}
