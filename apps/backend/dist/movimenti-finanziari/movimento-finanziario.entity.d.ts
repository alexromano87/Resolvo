import { Pratica } from '../pratiche/pratica.entity';
import { Studio } from '../studi/studio.entity';
export type TipoMovimento = 'capitale' | 'anticipazione' | 'compenso' | 'interessi' | 'recupero_capitale' | 'recupero_anticipazione' | 'recupero_compenso' | 'recupero_interessi';
export declare class MovimentoFinanziario {
    id: string;
    studioId: string | null;
    studio: Studio | null;
    praticaId: string;
    pratica: Pratica;
    tipo: TipoMovimento;
    importo: number;
    data: Date;
    oggetto?: string;
    createdAt: Date;
    updatedAt: Date;
}
