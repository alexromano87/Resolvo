import type { TipoMovimento } from './movimento-finanziario.entity';
export declare class CreateMovimentoFinanziarioDto {
    studioId?: string | null;
    praticaId: string;
    tipo: TipoMovimento;
    importo: number;
    data: string;
    oggetto?: string;
}
