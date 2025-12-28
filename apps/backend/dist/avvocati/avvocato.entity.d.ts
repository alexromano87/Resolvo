import { Pratica } from '../pratiche/pratica.entity';
import { Studio } from '../studi/studio.entity';
export type LivelloAccessoPratiche = 'solo_proprie' | 'tutte';
export type LivelloPermessi = 'visualizzazione' | 'modifica';
export declare class Avvocato {
    id: string;
    attivo: boolean;
    studioId: string | null;
    studio: Studio | null;
    nome: string;
    cognome: string;
    codiceFiscale?: string;
    email: string;
    telefono?: string;
    livelloAccessoPratiche: LivelloAccessoPratiche;
    livelloPermessi: LivelloPermessi;
    note?: string;
    pratiche: Pratica[];
    createdAt: Date;
    updatedAt: Date;
}
