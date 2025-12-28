import { ClientiService } from './clienti.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClientiDebitoriService } from '../relazioni/clienti-debitori.service';
import type { CurrentUserData } from '../auth/current-user.decorator';
export declare class ClientiController {
    private readonly clientiService;
    private readonly clientiDebitoriService;
    constructor(clientiService: ClientiService, clientiDebitoriService: ClientiDebitoriService);
    findAll(user: CurrentUserData, includeInactive?: string, page?: string, limit?: string): Promise<import("./cliente.entity").Cliente[]>;
    findOne(user: CurrentUserData, id: string): Promise<import("./cliente.entity").Cliente>;
    getPraticheCount(user: CurrentUserData, id: string): Promise<{
        count: number;
    }>;
    create(user: CurrentUserData, dto: CreateClienteDto): Promise<import("./cliente.entity").Cliente>;
    update(user: CurrentUserData, id: string, dto: UpdateClienteDto): Promise<import("./cliente.entity").Cliente>;
    deactivate(user: CurrentUserData, id: string): Promise<{
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
    reactivate(user: CurrentUserData, id: string): Promise<{
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
    remove(user: CurrentUserData, id: string): Promise<import("./cliente.entity").Cliente>;
    getDebitoriForCliente(user: CurrentUserData, id: string, includeInactive?: string): Promise<import("../debitori/debitore.entity").Debitore[]>;
    updateDebitoriForCliente(user: CurrentUserData, id: string, body: {
        debitoriIds: string[];
    }): Promise<{
        success: boolean;
    }>;
    unlinkDebitore(user: CurrentUserData, id: string, debitoreId: string): Promise<{
        success: boolean;
    }>;
    linkDebitore(user: CurrentUserData, id: string, debitoreId: string): Promise<{
        success: boolean;
    }>;
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
    updateConfigurazioneCondivisione(id: string, configurazione: any): Promise<import("./cliente.entity").Cliente>;
}
