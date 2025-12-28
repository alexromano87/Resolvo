import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Pratica } from '../pratiche/pratica.entity';
import type { CurrentUserData } from '../auth/current-user.decorator';
import { Avvocato } from '../avvocati/avvocato.entity';
import { type PaginationOptions } from '../common/pagination';
export declare class ClientiService {
    private readonly repo;
    private readonly praticheRepo;
    private readonly avvocatiRepo;
    constructor(repo: Repository<Cliente>, praticheRepo: Repository<Pratica>, avvocatiRepo: Repository<Avvocato>);
    create(data: CreateClienteDto): Promise<Cliente>;
    findAll(includeInactive?: boolean, studioId?: string, pagination?: PaginationOptions): Promise<Cliente[]>;
    findAllForUser(user: CurrentUserData, includeInactive?: boolean, pagination?: PaginationOptions): Promise<Cliente[]>;
    private getAvvocatoAccess;
    private findAllAssigned;
    findOne(id: string): Promise<Cliente>;
    update(id: string, data: UpdateClienteDto): Promise<Cliente>;
    deactivate(id: string): Promise<{
        attivo: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studioId: string | null;
        studio: import("../studi/studio.entity").Studio | null;
        ragioneSociale: string;
        codiceFiscale?: string;
        partitaIva?: string;
        sedeLegale?: string;
        sedeOperativa?: string;
        indirizzo?: string;
        cap?: string;
        citta?: string;
        provincia?: string;
        nazione?: string;
        tipologia?: import("./cliente.entity").TipologiaAzienda;
        referente?: string;
        referenteNome?: string;
        referenteCognome?: string;
        referenteEmail?: string;
        telefono?: string;
        email: string;
        pec?: string;
        configurazioneCondivisione?: {
            abilitata: boolean;
            dashboard: {
                stats: boolean;
                kpi: boolean;
            };
            pratiche: {
                elenco: boolean;
                dettagli: boolean;
                documenti: boolean;
                movimentiFinanziari: boolean;
                timeline: boolean;
            };
        };
        clientiDebitori: import("../relazioni/cliente-debitore.entity").ClienteDebitore[];
    }>;
    reactivate(id: string): Promise<{
        attivo: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studioId: string | null;
        studio: import("../studi/studio.entity").Studio | null;
        ragioneSociale: string;
        codiceFiscale?: string;
        partitaIva?: string;
        sedeLegale?: string;
        sedeOperativa?: string;
        indirizzo?: string;
        cap?: string;
        citta?: string;
        provincia?: string;
        nazione?: string;
        tipologia?: import("./cliente.entity").TipologiaAzienda;
        referente?: string;
        referenteNome?: string;
        referenteCognome?: string;
        referenteEmail?: string;
        telefono?: string;
        email: string;
        pec?: string;
        configurazioneCondivisione?: {
            abilitata: boolean;
            dashboard: {
                stats: boolean;
                kpi: boolean;
            };
            pratiche: {
                elenco: boolean;
                dettagli: boolean;
                documenti: boolean;
                movimentiFinanziari: boolean;
                timeline: boolean;
            };
        };
        clientiDebitori: import("../relazioni/cliente-debitore.entity").ClienteDebitore[];
    }>;
    remove(id: string): Promise<Cliente>;
    countPraticheCollegate(id: string): Promise<number>;
    canAccessCliente(user: CurrentUserData, clienteId: string): Promise<boolean>;
    getConfigurazioneCondivisione(id: string): Promise<{
        abilitata: boolean;
        dashboard: {
            stats: boolean;
            kpi: boolean;
        };
        pratiche: {
            elenco: boolean;
            dettagli: boolean;
            documenti: boolean;
            movimentiFinanziari: boolean;
            timeline: boolean;
        };
    }>;
    updateConfigurazioneCondivisione(id: string, configurazione: any): Promise<Cliente>;
}
