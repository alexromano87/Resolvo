import type { UserRole } from '../user.entity';
export declare class UpdateUserDto {
    email?: string;
    password?: string;
    nome?: string;
    cognome?: string;
    telefono?: string | null;
    ruolo?: UserRole;
    clienteId?: string | null;
    studioId?: string | null;
    attivo?: boolean;
}
