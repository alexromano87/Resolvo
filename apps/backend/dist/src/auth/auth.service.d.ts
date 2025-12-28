import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Cliente } from '../clienti/cliente.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { EmailService } from '../notifications/email.service';
export declare class AuthService {
    private userRepository;
    private clienteRepository;
    private jwtService;
    private emailService;
    constructor(userRepository: Repository<User>, clienteRepository: Repository<Cliente>, jwtService: JwtService, emailService: EmailService);
    private readonly lockoutThreshold;
    private readonly lockoutWindowMs;
    private readonly refreshTokenTtlMs;
    private resolveClienteIdForUser;
    private issueTokens;
    private buildUserResponse;
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            nome: string;
            cognome: string;
            ruolo: import("../users/user.entity").UserRole;
            clienteId: string | null;
            attivo: boolean;
            studioId: string | null;
            telefono: string | null;
            twoFactorEnabled: boolean;
            twoFactorChannel: string | null;
            settings: Record<string, unknown> | null;
        };
        access_token: string;
        refresh_token: string;
    }>;
    private sendTwoFactorCode;
    private generateTwoFactorCode;
    private sendPasswordResetCode;
    private findUserWithPasswordByEmail;
    private findUserWithPasswordById;
    login(loginDto: LoginDto): Promise<{
        requiresTwoFactor: boolean;
        userId: string;
        channel: "email" | "sms";
    } | {
        user: {
            id: string;
            email: string;
            nome: string;
            cognome: string;
            ruolo: import("../users/user.entity").UserRole;
            clienteId: string | null;
            attivo: boolean;
            studioId: string | null;
            telefono: string | null;
            twoFactorEnabled: boolean;
            twoFactorChannel: string | null;
            settings: Record<string, unknown> | null;
        };
        access_token: string;
        refresh_token: string;
        requiresTwoFactor?: undefined;
        userId?: undefined;
        channel?: undefined;
    }>;
    verifyTwoFactorLogin(userId: string, code: string): Promise<{
        user: {
            id: string;
            email: string;
            nome: string;
            cognome: string;
            ruolo: import("../users/user.entity").UserRole;
            clienteId: string | null;
            attivo: boolean;
            studioId: string | null;
            telefono: string | null;
            twoFactorEnabled: boolean;
            twoFactorChannel: string | null;
            settings: Record<string, unknown> | null;
        };
        access_token: string;
        refresh_token: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        nome: string;
        cognome: string;
        telefono: string | null;
        ruolo: import("../users/user.entity").UserRole;
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
        studio: import("../studi/studio.entity").Studio | null;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        user: {
            id: string;
            email: string;
            nome: string;
            cognome: string;
            ruolo: import("../users/user.entity").UserRole;
            clienteId: string | null;
            attivo: boolean;
            studioId: string | null;
            telefono: string | null;
            twoFactorEnabled: boolean;
            twoFactorChannel: string | null;
            settings: Record<string, unknown> | null;
        };
        access_token: string;
        refresh_token: string;
    }>;
    requestPasswordReset(email: string): Promise<{
        success: boolean;
    }>;
    confirmPasswordReset(email: string, token: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    refreshToken(userId: string, refreshToken: string): Promise<{
        user: {
            id: string;
            email: string;
            nome: string;
            cognome: string;
            ruolo: import("../users/user.entity").UserRole;
            clienteId: string | null;
            attivo: boolean;
            studioId: string | null;
            telefono: string | null;
            twoFactorEnabled: boolean;
            twoFactorChannel: string | null;
            settings: Record<string, unknown> | null;
        };
        access_token: string;
        refresh_token: string;
    }>;
    logoutAll(userId: string): Promise<{
        success: boolean;
    }>;
    getSettings(userId: string): Promise<{
        settings: Record<string, unknown> | null;
        telefono: string | null;
        twoFactorEnabled: boolean;
        twoFactorChannel: string | null;
    }>;
    updateSettings(userId: string, dto: UpdateSettingsDto): Promise<{
        settings: Record<string, unknown>;
        telefono: string | null;
        twoFactorEnabled: boolean;
        twoFactorChannel: string | null;
    }>;
    requestTwoFactorEnable(userId: string, channel: 'sms' | 'email', telefono?: string): Promise<{
        success: boolean;
    }>;
    verifyTwoFactorEnable(userId: string, code: string): Promise<{
        success: boolean;
    }>;
    requestTwoFactorDisable(userId: string): Promise<{
        success: boolean;
    }>;
    verifyTwoFactorDisable(userId: string, code: string): Promise<{
        success: boolean;
    }>;
}
