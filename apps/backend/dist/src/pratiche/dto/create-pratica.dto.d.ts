import type { EsitoPratica, EsitoOpposizione, EsitoPignoramento, TipoPignoramento } from '../pratica.entity';
declare class OpposizioneDto {
    esito?: EsitoOpposizione;
    dataEsito?: string;
    note?: string;
}
declare class PignoramentoDto {
    tipo?: TipoPignoramento;
    dataNotifica?: string;
    esito?: EsitoPignoramento;
    note?: string;
}
export declare class CreatePraticaDto {
    clienteId: string;
    debitoreId: string;
    studioId?: string | null;
    avvocatiIds?: string[];
    collaboratoriIds?: string[];
    faseId?: string;
    aperta?: boolean;
    esito?: EsitoPratica;
    capitale?: number;
    importoRecuperatoCapitale?: number;
    anticipazioni?: number;
    importoRecuperatoAnticipazioni?: number;
    compensiLegali?: number;
    compensiLiquidati?: number;
    interessi?: number;
    interessiRecuperati?: number;
    note?: string;
    riferimentoCredito?: string;
    opposizione?: OpposizioneDto;
    pignoramento?: PignoramentoDto;
    dataAffidamento?: string;
    dataChiusura?: string;
    dataScadenza?: string;
}
export {};
