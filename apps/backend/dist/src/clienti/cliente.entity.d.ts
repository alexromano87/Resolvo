import { ClienteDebitore } from '../relazioni/cliente-debitore.entity';
import { Studio } from '../studi/studio.entity';
export type TipologiaAzienda = 'impresa_individuale' | 'impresa_individuale_agricola' | 'srl' | 'spa' | 'scpa' | 'srl_agricola' | 'snc' | 'sas';
export declare class Cliente {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    attivo: boolean;
    studioId: string | null;
    studio: Studio | null;
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
    configurazioneCondivisione?: {
        abilitata: boolean;
        dashboard: {
            stats: boolean;
            kpi: boolean;
        };
        pratiche: {
            elenco: boolean;
            dettagli: boolean;
            documenti: boolean;
            movimentiFinanziari: boolean;
            timeline: boolean;
        };
    };
    clientiDebitori: ClienteDebitore[];
}
