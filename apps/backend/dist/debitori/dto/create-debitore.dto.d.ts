import type { TipoSoggetto, TipologiaAzienda } from '../debitore.entity';
export declare class CreateDebitoreDto {
    studioId?: string | null;
    tipoSoggetto: TipoSoggetto;
    nome?: string;
    cognome?: string;
    codiceFiscale?: string;
    dataNascita?: string;
    luogoNascita?: string;
    ragioneSociale?: string;
    partitaIva?: string;
    tipologia?: TipologiaAzienda;
    sedeLegale?: string;
    sedeOperativa?: string;
    indirizzo?: string;
    cap?: string;
    citta?: string;
    provincia?: string;
    nazione?: string;
    referente?: string;
    telefono?: string;
    email?: string;
    pec?: string;
    clientiIds?: string[];
}
