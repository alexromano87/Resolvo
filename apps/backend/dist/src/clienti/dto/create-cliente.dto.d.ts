import type { TipologiaAzienda } from '../cliente.entity';
export declare class CreateClienteDto {
    studioId?: string | null;
    ragioneSociale: string;
    codiceFiscale?: string;
    partitaIva?: string;
    sedeLegale?: string;
    sedeOperativa?: string;
    indirizzo?: string;
    cap?: string;
    citta?: string;
    provincia?: string;
    nazione?: string;
    tipologia?: TipologiaAzienda;
    referente?: string;
    referenteNome?: string;
    referenteCognome?: string;
    referenteEmail?: string;
    telefono?: string;
    email: string;
    pec?: string;
}
