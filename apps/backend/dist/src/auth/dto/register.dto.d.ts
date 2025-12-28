import type { UserRole } from '../../users/user.entity';
export declare class RegisterDto {
    email: string;
    password: string;
    nome: string;
    cognome: string;
    ruolo?: UserRole;
    clienteId?: string | null;
}
