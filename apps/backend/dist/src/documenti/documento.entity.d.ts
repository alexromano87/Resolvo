import { Pratica } from '../pratiche/pratica.entity';
import { Cartella } from '../cartelle/cartella.entity';
import { Studio } from '../studi/studio.entity';
export type TipoDocumento = 'pdf' | 'word' | 'excel' | 'immagine' | 'csv' | 'xml' | 'altro';
export declare class Documento {
    id: string;
    studioId: string | null;
    studio: Studio | null;
    nome: string;
    descrizione: string | null;
    percorsoFile: string;
    nomeOriginale: string;
    estensione: string;
    tipo: TipoDocumento;
    dimensione: number;
    caricatoDa: string | null;
    praticaId: string | null;
    pratica: Pratica | null;
    cartellaId: string | null;
    cartella: Cartella | null;
    attivo: boolean;
    dataCreazione: Date;
    dataAggiornamento: Date;
}
