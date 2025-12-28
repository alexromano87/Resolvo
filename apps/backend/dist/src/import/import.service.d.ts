import { Repository } from 'typeorm';
import { Cliente } from '../clienti/cliente.entity';
import { Debitore } from '../debitori/debitore.entity';
import { Avvocato } from '../avvocati/avvocato.entity';
import { Pratica } from '../pratiche/pratica.entity';
import { MovimentoFinanziario } from '../movimenti-finanziari/movimento-finanziario.entity';
import { Documento } from '../documenti/documento.entity';
import { Alert } from '../alerts/alert.entity';
import { Ticket } from '../tickets/ticket.entity';
import { AuditLog } from '../audit/audit-log.entity';
import { User } from '../users/user.entity';
import { ImportCsvEntity } from './dto/import-request.dto';
type ImportError = {
    row: number;
    reason: string;
};
type ImportResult = {
    total: number;
    imported: number;
    skipped: number;
    errors: ImportError[];
};
export declare class ImportService {
    private clientiRepo;
    private debitoriRepo;
    private avvocatiRepo;
    private praticheRepo;
    private movimentiRepo;
    private documentiRepo;
    private alertsRepo;
    private ticketsRepo;
    private auditLogsRepo;
    private usersRepo;
    constructor(clientiRepo: Repository<Cliente>, debitoriRepo: Repository<Debitore>, avvocatiRepo: Repository<Avvocato>, praticheRepo: Repository<Pratica>, movimentiRepo: Repository<MovimentoFinanziario>, documentiRepo: Repository<Documento>, alertsRepo: Repository<Alert>, ticketsRepo: Repository<Ticket>, auditLogsRepo: Repository<AuditLog>, usersRepo: Repository<User>);
    importBackup(buffer: Buffer): Promise<{
        results: Record<string, ImportResult>;
        errors: {
            entity: string;
            row: number;
            reason: string;
        }[];
    }>;
    importCsv(entity: ImportCsvEntity, buffer: Buffer): Promise<ImportResult>;
    private importRecords;
    private pickFields;
    private coerceValue;
    private normalizeCsvRow;
    private normalizeHeader;
    private detectCsvLayout;
    private clienteCsvMap;
    private debitoreCsvMap;
    private syncPraticheAvvocati;
    private clienteFields;
    private debitoreFields;
    private avvocatoFields;
    private userFields;
    private praticaFields;
    private movimentoFields;
    private documentoFields;
    private alertFields;
    private ticketFields;
    private auditLogFields;
}
export {};
