import { Repository } from 'typeorm';
import { Pratica } from '../pratiche/pratica.entity';
import { Cliente } from '../clienti/cliente.entity';
import { Debitore } from '../debitori/debitore.entity';
import { Avvocato } from '../avvocati/avvocato.entity';
import { MovimentoFinanziario } from '../movimenti-finanziari/movimento-finanziario.entity';
import { Alert } from '../alerts/alert.entity';
import { Ticket } from '../tickets/ticket.entity';
import { Documento } from '../documenti/documento.entity';
import { Cartella } from '../cartelle/cartella.entity';
import { User } from '../users/user.entity';
export interface OrphanDataReport {
    praticheSenzaStudio: number;
    clientiSenzaStudio: number;
    debitoriSenzaStudio: number;
    avvocatiSenzaStudio: number;
    movimentiFinanziariSenzaStudio: number;
    alertsSenzaStudio: number;
    ticketsSenzaStudio: number;
    documentiSenzaStudio: number;
    cartelleSenzaStudio: number;
    utentiSenzaStudio: number;
}
export declare class AdminMaintenanceService {
    private praticheRepository;
    private clienteRepository;
    private debitoreRepository;
    private avvocatoRepository;
    private movimentiFinanziariRepository;
    private alertRepository;
    private ticketRepository;
    private documentoRepository;
    private cartellaRepository;
    private userRepository;
    constructor(praticheRepository: Repository<Pratica>, clienteRepository: Repository<Cliente>, debitoreRepository: Repository<Debitore>, avvocatoRepository: Repository<Avvocato>, movimentiFinanziariRepository: Repository<MovimentoFinanziario>, alertRepository: Repository<Alert>, ticketRepository: Repository<Ticket>, documentoRepository: Repository<Documento>, cartellaRepository: Repository<Cartella>, userRepository: Repository<User>);
    getOrphanData(): Promise<OrphanDataReport>;
    assignOrphanDataToStudio(studioId: string): Promise<{
        message: string;
        updated: any;
    }>;
}
