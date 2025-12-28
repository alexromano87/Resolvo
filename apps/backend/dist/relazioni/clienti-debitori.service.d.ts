import { Repository } from 'typeorm';
import { ClienteDebitore } from './cliente-debitore.entity';
import { Debitore } from '../debitori/debitore.entity';
export declare class ClientiDebitoriService {
    private readonly cdRepo;
    private readonly debitoriRepo;
    constructor(cdRepo: Repository<ClienteDebitore>, debitoriRepo: Repository<Debitore>);
    getDebitoriByCliente(clienteId: string, includeInactive?: boolean): Promise<Debitore[]>;
    linkDebitoreToCliente(clienteId: string, debitoreId: string): Promise<void>;
    setDebitoriForCliente(clienteId: string, debitoriIds: string[]): Promise<void>;
    unlinkDebitoreFromCliente(clienteId: string, debitoreId: string): Promise<void>;
    getClientiByDebitore(debitoreId: string): Promise<string[]>;
}
