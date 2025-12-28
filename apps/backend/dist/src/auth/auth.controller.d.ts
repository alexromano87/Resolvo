import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { type CurrentUserData } from './current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { TwoFactorLoginVerifyDto, TwoFactorRequestDto, TwoFactorVerifyDto } from './dto/two-factor.dto';
import { PasswordResetRequestDto, PasswordResetConfirmDto } from './dto/password-reset.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    requestPasswordReset(dto: PasswordResetRequestDto): Promise<{
        success: boolean;
    }>;
    confirmPasswordReset(dto: PasswordResetConfirmDto): Promise<{
        success: boolean;
    }>;
    verifyTwoFactorLogin(dto: TwoFactorLoginVerifyDto): Promise<{
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
    refresh(dto: RefreshTokenDto): Promise<{
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
    getProfile(user: CurrentUserData): Promise<{
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
    getCurrentUser(user: CurrentUserData): Promise<CurrentUserData>;
    changePassword(user: CurrentUserData, dto: ChangePasswordDto): Promise<{
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
    logoutAll(user: CurrentUserData): Promise<{
        success: boolean;
    }>;
    getSettings(user: CurrentUserData): Promise<{
        settings: Record<string, unknown> | null;
        telefono: string | null;
        twoFactorEnabled: boolean;
        twoFactorChannel: string | null;
    }>;
    updateSettings(user: CurrentUserData, dto: UpdateSettingsDto): Promise<{
        settings: Record<string, unknown>;
        telefono: string | null;
        twoFactorEnabled: boolean;
        twoFactorChannel: string | null;
    }>;
    requestEnableTwoFactor(user: CurrentUserData, dto: TwoFactorRequestDto): Promise<{
        success: boolean;
    }>;
    verifyEnableTwoFactor(user: CurrentUserData, dto: TwoFactorVerifyDto): Promise<{
        success: boolean;
    }>;
    requestDisableTwoFactor(user: CurrentUserData): Promise<{
        success: boolean;
    }>;
    verifyDisableTwoFactor(user: CurrentUserData, dto: TwoFactorVerifyDto): Promise<{
        success: boolean;
    }>;
}
