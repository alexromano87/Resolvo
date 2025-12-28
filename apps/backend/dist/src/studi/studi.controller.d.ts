import { StudiService } from './studi.service';
import { CreateStudioDto } from './dto/create-studio.dto';
import { UpdateStudioDto } from './dto/update-studio.dto';
export declare class StudiController {
    private readonly studiService;
    constructor(studiService: StudiService);
    findAll(): Promise<import("./studio.entity").Studio[]>;
    findAllActive(): Promise<import("./studio.entity").Studio[]>;
    findOne(id: string): Promise<import("./studio.entity").Studio>;
    create(createStudioDto: CreateStudioDto): Promise<import("./studio.entity").Studio>;
    update(id: string, updateStudioDto: UpdateStudioDto): Promise<import("./studio.entity").Studio>;
    remove(id: string): Promise<void>;
    toggleActive(id: string): Promise<import("./studio.entity").Studio>;
    getStudioStats(id: string): Promise<{
        studio: {
            id: string;
            nome: string;
            ragioneSociale: string;
            email: string;
            telefono: string;
            attivo: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        statistiche: {
            numeroUtenti: number;
            utentiAttivi: number;
            utentiPerRuolo: Record<string, number>;
            numeroPratiche: number;
            praticheAperte: number;
            praticheChiuse: number;
            numeroClienti: number;
            numeroDebitori: number;
            numeroAvvocati: number;
            numeroDocumenti: number;
            storageUtilizzatoMB: number;
            alertsAperti: number;
            ticketsAperti: number;
        };
        finanziari: {
            capitaleAffidato: number;
            capitaleRecuperato: number;
            percentualeRecupero: string;
        };
    }>;
}
