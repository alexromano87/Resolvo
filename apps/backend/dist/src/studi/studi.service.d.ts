import { Repository } from 'typeorm';
import { Studio } from './studio.entity';
import { CreateStudioDto } from './dto/create-studio.dto';
import { UpdateStudioDto } from './dto/update-studio.dto';
export declare class StudiService {
    private studioRepository;
    constructor(studioRepository: Repository<Studio>);
    findAll(): Promise<Studio[]>;
    findAllActive(): Promise<Studio[]>;
    findOne(id: string): Promise<Studio>;
    create(createStudioDto: CreateStudioDto): Promise<Studio>;
    update(id: string, updateStudioDto: UpdateStudioDto): Promise<Studio>;
    remove(id: string): Promise<void>;
    toggleActive(id: string): Promise<Studio>;
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
