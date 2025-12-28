export interface FaseDefinition {
    id: string;
    nome: string;
    codice: string;
    descrizione: string;
    ordine: number;
    colore: string;
    icona: string;
    isFaseChiusura: boolean;
}
export declare const FASI: FaseDefinition[];
export declare const FASE_DEFAULT_ID = "fase-001";
export declare function getFaseById(id: string): FaseDefinition | undefined;
export declare function getFaseByCodice(codice: string): FaseDefinition | undefined;
