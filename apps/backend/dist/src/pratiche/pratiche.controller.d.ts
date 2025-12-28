import { PraticheService } from './pratiche.service';
import { CreatePraticaDto } from './dto/create-pratica.dto';
import { UpdatePraticaDto } from './dto/update-pratica.dto';
import { CambiaFaseDto } from './dto/cambia-fase.dto';
import type { CurrentUserData } from '../auth/current-user.decorator';
export declare class PraticheController {
    private readonly praticheService;
    constructor(praticheService: PraticheService);
    findAll(user: CurrentUserData, includeInactive?: string, clienteId?: string, debitoreId?: string, page?: string, limit?: string): Promise<import("./pratica.entity").Pratica[]>;
    getStats(): Promise<{
        perFase: Record<string, number>;
        capitaleAffidato: number;
        capitaleRecuperato: number;
        capitaleDaRecuperare: number;
        anticipazioni: number;
        anticipazioniRecuperate: number;
        compensiMaturati: number;
        compensiLiquidati: number;
        aperte: number;
        chiusePositive: number;
        chiuseNegative: number;
        totali: number;
    }>;
    findOne(user: CurrentUserData, id: string): Promise<import("./pratica.entity").Pratica>;
    create(user: CurrentUserData, dto: CreatePraticaDto): Promise<import("./pratica.entity").Pratica>;
    update(user: CurrentUserData, id: string, dto: UpdatePraticaDto): Promise<import("./pratica.entity").Pratica>;
    cambiaFase(user: CurrentUserData, id: string, dto: CambiaFaseDto): Promise<import("./pratica.entity").Pratica>;
    riapri(user: CurrentUserData, id: string, body: {
        faseId?: string;
    }): Promise<import("./pratica.entity").Pratica>;
    deactivate(user: CurrentUserData, id: string): Promise<import("./pratica.entity").Pratica>;
    reactivate(user: CurrentUserData, id: string): Promise<import("./pratica.entity").Pratica>;
    remove(user: CurrentUserData, id: string): Promise<void>;
}
