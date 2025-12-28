import { FasiService } from './fasi.service';
export declare class FasiController {
    private readonly fasiService;
    constructor(fasiService: FasiService);
    findAll(): import("./fasi.constants").FaseDefinition[];
    findOne(id: string): import("./fasi.constants").FaseDefinition;
}
