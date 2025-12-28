import { Cliente } from '../clienti/cliente.entity';
import { Debitore } from '../debitori/debitore.entity';
import { Avvocato } from '../avvocati/avvocato.entity';
import { User } from '../users/user.entity';
import { MovimentoFinanziario } from '../movimenti-finanziari/movimento-finanziario.entity';
import { Studio } from '../studi/studio.entity';
export type EsitoPratica = 'positivo' | 'negativo' | null;
export interface StoricoFase {
    faseId: string;
    faseCodice: string;
    faseNome: string;
    dataInizio: string;
    dataFine?: string;
    note?: string;
}
export type EsitoOpposizione = 'rigetto' | 'accoglimento_parziale' | 'accoglimento_totale';
export type TipoPignoramento = 'mobiliare_debitore' | 'mobiliare_terzi' | 'immobiliare';
export type EsitoPignoramento = 'iscrizione_a_ruolo' | 'desistenza' | 'opposizione';
export interface OpposizioneDettagli {
    esito?: EsitoOpposizione;
    dataEsito?: string;
    note?: string;
}
export interface PignoramentoDettagli {
    tipo?: TipoPignoramento;
    dataNotifica?: string;
    esito?: EsitoPignoramento;
    note?: string;
}
export declare class Pratica {
    id: string;
    attivo: boolean;
    clienteId: string;
    cliente: Cliente;
    studioId: string | null;
    studio: Studio | null;
    debitoreId: string;
    debitore: Debitore;
    avvocati: Avvocato[];
    collaboratori: User[];
    movimentiFinanziari: MovimentoFinanziario[];
    faseId: string;
    aperta: boolean;
    esito: EsitoPratica;
    capitale: number;
    importoRecuperatoCapitale: number;
    anticipazioni: number;
    importoRecuperatoAnticipazioni: number;
    compensiLegali: number;
    compensiLiquidati: number;
    interessi: number;
    interessiRecuperati: number;
    note?: string;
    riferimentoCredito?: string;
    storico?: StoricoFase[];
    opposizione?: OpposizioneDettagli;
    pignoramento?: PignoramentoDettagli;
    dataAffidamento?: Date;
    dataChiusura?: Date;
    dataScadenza?: Date;
    createdAt: Date;
    updatedAt: Date;
}
