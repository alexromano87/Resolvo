import type { UserRole } from '../user.entity';
export declare class CreateUserDto {
    email: string;
    password: string;
    nome: string;
    cognome: string;
    telefono?: string | null;
    ruolo: UserRole;
    clienteId?: string | null;
    studioId?: string | null;
}
