import { Repository } from 'typeorm';
import { Pratica } from '../pratiche/pratica.entity';
import { Cliente } from '../clienti/cliente.entity';
import { Studio } from '../studi/studio.entity';
import { User } from '../users/user.entity';
import { Debitore } from '../debitori/debitore.entity';
import { Avvocato } from '../avvocati/avvocato.entity';
import { Documento } from '../documenti/documento.entity';
import { MovimentoFinanziario } from '../movimenti-finanziari/movimento-finanziario.entity';
import type { CurrentUserData } from '../auth/current-user.decorator';
export interface DashboardStats {
    numeroPratiche: number;
    praticheAperte: number;
    praticheChiuse: number;
    praticheChiusePositive: number;
    praticheChiuseNegative: number;
    capitaleAffidato: number;
    interessiAffidati: number;
    anticipazioniAffidate: number;
    compensiAffidati: number;
    capitaleRecuperato: number;
    interessiRecuperati: number;
    anticipazioniRecuperate: number;
    compensiRecuperati: number;
    percentualeRecuperoCapitale: number;
    percentualeRecuperoInteressi: number;
    percentualeRecuperoAnticipazioni: number;
    percentualeRecuperoCompensi: number;
}
export interface KPI {
    totalePraticheAffidate: number;
    totalePraticheChiuse: number;
    percentualeChiusura: number;
    esitoNegativo: number;
    esitoPositivo: number;
    esitoPositivoParziale: number;
    esitoPositivoTotale: number;
    recuperoCapitale: {
        totale: number;
        parziale: number;
        completo: number;
    };
    recuperoInteressi: {
        totale: number;
        parziale: number;
        completo: number;
    };
    recuperoCompensi: {
        totale: number;
        parziale: number;
        completo: number;
    };
}
export interface AdminDashboardStats {
    totali: {
        studi: number;
        studiAttivi: number;
        utenti: number;
        utentiAttivi: number;
        pratiche: number;
        praticheAperte: number;
        clienti: number;
        debitori: number;
        avvocati: number;
    };
    perStudio: Array<{
        studioId: string;
        studioNome: string;
        studioAttivo: boolean;
        numeroUtenti: number;
        numeroPratiche: number;
        numeroClienti: number;
        numeroDebitori: number;
        numeroAvvocati: number;
    }>;
    attivitaRecente: {
        ultimiUtentiCreati: Array<{
            id: string;
            nome: string;
            cognome: string;
            email: string;
            ruolo: string;
            studioNome: string | null;
            createdAt: Date;
        }>;
        ultimePraticheCreate: Array<{
            id: string;
            numeroProtocollo: string;
            cliente: string;
            debitore: string;
            studioNome: string | null;
            createdAt: Date;
        }>;
    };
}
export declare class DashboardService {
    private praticheRepository;
    private clienteRepository;
    private studioRepository;
    private userRepository;
    private debitoreRepository;
    private avvocatoRepository;
    private documentiRepository;
    private movimentiRepository;
    constructor(praticheRepository: Repository<Pratica>, clienteRepository: Repository<Cliente>, studioRepository: Repository<Studio>, userRepository: Repository<User>, debitoreRepository: Repository<Debitore>, avvocatoRepository: Repository<Avvocato>, documentiRepository: Repository<Documento>, movimentiRepository: Repository<MovimentoFinanziario>);
    getStats(clienteId?: string, studioId?: string, user?: CurrentUserData): Promise<DashboardStats>;
    getKPI(clienteId?: string, studioId?: string, user?: CurrentUserData): Promise<KPI>;
    getDashboardCondivisa(clienteId: string): Promise<any>;
    getAdminDashboard(): Promise<AdminDashboardStats>;
    private buildPraticaLabel;
    private buildPraticaDebitoreLabel;
    private canAvvocatoSeeAll;
}
