import { Pratica } from '../pratiche/pratica.entity';
import { Documento } from '../documenti/documento.entity';
import { Studio } from '../studi/studio.entity';
export declare class Cartella {
    id: string;
    studioId: string | null;
    studio: Studio | null;
    nome: string;
    descrizione: string | null;
    colore: string | null;
    praticaId: string | null;
    pratica: Pratica | null;
    cartellaParent: Cartella | null;
    sottoCartelle: Cartella[];
    documenti: Documento[];
    attivo: boolean;
    dataCreazione: Date;
    dataAggiornamento: Date;
}
