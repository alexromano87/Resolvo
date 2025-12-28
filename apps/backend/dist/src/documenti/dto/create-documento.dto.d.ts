import type { TipoDocumento } from '../documento.entity';
export declare class CreateDocumentoDto {
    studioId?: string | null;
    nome: string;
    descrizione?: string;
    percorsoFile: string;
    nomeOriginale: string;
    estensione: string;
    tipo: TipoDocumento;
    dimensione: number;
    caricatoDa?: string;
    praticaId?: string;
    cartellaId?: string;
}
