import type { LivelloAccessoPratiche, LivelloPermessi } from './avvocato.entity';
export declare class CreateAvvocatoDto {
    studioId?: string | null;
    nome: string;
    cognome: string;
    email: string;
    codiceFiscale?: string;
    telefono?: string;
    livelloAccessoPratiche?: LivelloAccessoPratiche;
    livelloPermessi?: LivelloPermessi;
    note?: string;
}
