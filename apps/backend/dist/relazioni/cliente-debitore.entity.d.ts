import { Cliente } from '../clienti/cliente.entity';
import { Debitore } from '../debitori/debitore.entity';
export declare class ClienteDebitore {
    id: string;
    clienteId: string;
    debitoreId: string;
    cliente: Cliente;
    debitore: Debitore;
    attivo: boolean;
    createdAt: Date;
}
