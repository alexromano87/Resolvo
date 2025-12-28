import { Studio } from '../studi/studio.entity';
export type UserRole = 'admin' | 'titolare_studio' | 'avvocato' | 'collaboratore' | 'segreteria' | 'cliente';
export declare class User {
    id: string;
    email: string;
    password: string;
    nome: string;
    cognome: string;
    telefono: string | null;
    ruolo: UserRole;
    clienteId: string | null;
    studioId: string | null;
    attivo: boolean;
    tokenVersion: number;
    twoFactorEnabled: boolean;
    twoFactorChannel: string | null;
    twoFactorCode: string | null;
    twoFactorCodeExpires: Date | null;
    twoFactorCodePurpose: string | null;
    failedLoginAttempts: number;
    lockoutUntil: Date | null;
    refreshTokenHash: string | null;
    refreshTokenExpiresAt: Date | null;
    settings: Record<string, unknown> | null;
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date | null;
    studio: Studio | null;
}
