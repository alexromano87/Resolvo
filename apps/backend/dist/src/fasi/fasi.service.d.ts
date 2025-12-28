import { FaseDefinition } from './fasi.constants';
export declare class FasiService {
    findAll(): FaseDefinition[];
    findOne(id: string): FaseDefinition;
    findByCodice(codice: string): FaseDefinition | undefined;
    getDefaultFase(): FaseDefinition;
    getDefaultFaseId(): string;
    isFaseChiusura(faseId: string): boolean;
}
