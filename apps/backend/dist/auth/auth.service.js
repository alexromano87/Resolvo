"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const user_entity_1 = require("../users/user.entity");
const cliente_entity_1 = require("../clienti/cliente.entity");
const email_service_1 = require("../notifications/email.service");
let AuthService = class AuthService {
    userRepository;
    clienteRepository;
    jwtService;
    emailService;
    constructor(userRepository, clienteRepository, jwtService, emailService) {
        this.userRepository = userRepository;
        this.clienteRepository = clienteRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    lockoutThreshold = 5;
    lockoutWindowMs = 15 * 60 * 1000;
    refreshTokenTtlMs = 30 * 24 * 60 * 60 * 1000;
    async resolveClienteIdForUser(user) {
        if (user.ruolo !== 'cliente') {
            return user.clienteId ?? null;
        }
        if (user.clienteId) {
            return user.clienteId;
        }
        const email = user.email.toLowerCase().trim();
        const cliente = await this.clienteRepository
            .createQueryBuilder('cliente')
            .where('LOWER(cliente.referenteEmail) = :email', { email })
            .orWhere('LOWER(cliente.email) = :email', { email })
            .getOne();
        return cliente?.id ?? null;
    }
    async issueTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            ruolo: user.ruolo,
            tokenVersion: user.tokenVersion ?? 0,
        };
        const refreshToken = (0, crypto_1.randomBytes)(48).toString('hex');
        user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        user.refreshTokenExpiresAt = new Date(Date.now() + this.refreshTokenTtlMs);
        await this.userRepository.save(user);
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refreshToken,
        };
    }
    async buildUserResponse(user) {
        const resolvedClienteId = await this.resolveClienteIdForUser(user);
        return {
            id: user.id,
            email: user.email,
            nome: user.nome,
            cognome: user.cognome,
            ruolo: user.ruolo,
            clienteId: resolvedClienteId,
            attivo: user.attivo,
            studioId: user.studioId,
            telefono: user.telefono,
            twoFactorEnabled: user.twoFactorEnabled,
            twoFactorChannel: user.twoFactorChannel,
            settings: user.settings,
        };
    }
    async register(registerDto) {
        const normalizedEmail = registerDto.email.toLowerCase().trim();
        const existingUser = await this.userRepository.findOne({
            where: { email: normalizedEmail },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email già registrata');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = this.userRepository.create({
            email: normalizedEmail,
            password: hashedPassword,
            nome: registerDto.nome,
            cognome: registerDto.cognome,
            ruolo: registerDto.ruolo || 'collaboratore',
            clienteId: registerDto.clienteId || null,
            telefono: null,
            settings: null,
        });
        await this.userRepository.save(user);
        const tokens = await this.issueTokens(user);
        return {
            ...tokens,
            user: await this.buildUserResponse(user),
        };
    }
    async sendTwoFactorCode(channel, destination, code) {
        if (channel === 'sms') {
            console.info(`[2FA][SMS] Code ${code} to ${destination}`);
        }
        else {
            console.info(`[2FA][Email] Code ${code} to ${destination}`);
        }
    }
    generateTwoFactorCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async sendPasswordResetCode(email, token) {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const link = `${baseUrl}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
        await this.emailService.sendEmail({
            to: email,
            subject: 'Link per recupero password',
            text: [
                'Hai richiesto il recupero della password.',
                `Link per il reset: ${link}`,
                'Il link scade tra 15 minuti.',
            ].join('\n'),
        });
    }
    async findUserWithPasswordByEmail(email) {
        return this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email })
            .getOne();
    }
    async findUserWithPasswordById(userId) {
        return this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.id = :id', { id: userId })
            .getOne();
    }
    async login(loginDto) {
        const normalizedEmail = loginDto.email.toLowerCase().trim();
        const user = await this.findUserWithPasswordByEmail(normalizedEmail);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenziali non valide');
        }
        if (!user.attivo) {
            throw new common_1.UnauthorizedException('Utente disattivato');
        }
        if (user.lockoutUntil && user.lockoutUntil.getTime() > Date.now()) {
            throw new common_1.UnauthorizedException('Account temporaneamente bloccato');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            const attempts = (user.failedLoginAttempts ?? 0) + 1;
            const update = { failedLoginAttempts: attempts };
            if (attempts >= this.lockoutThreshold) {
                update.lockoutUntil = new Date(Date.now() + this.lockoutWindowMs);
                update.failedLoginAttempts = 0;
            }
            await this.userRepository.update(user.id, update);
            throw new common_1.UnauthorizedException('Credenziali non valide');
        }
        if (user.failedLoginAttempts || user.lockoutUntil) {
            await this.userRepository.update(user.id, {
                failedLoginAttempts: 0,
                lockoutUntil: null,
            });
        }
        if (user.twoFactorEnabled) {
            const code = this.generateTwoFactorCode();
            user.twoFactorCode = code;
            user.twoFactorCodePurpose = 'login';
            user.twoFactorCodeExpires = new Date(Date.now() + 5 * 60 * 1000);
            await this.userRepository.save(user);
            const channel = (user.twoFactorChannel || 'email');
            const destination = channel === 'sms' ? user.telefono : user.email;
            if (!destination) {
                throw new common_1.BadRequestException('Canale 2FA non configurato');
            }
            await this.sendTwoFactorCode(channel, destination, code);
            return {
                requiresTwoFactor: true,
                userId: user.id,
                channel,
            };
        }
        await this.userRepository.update(user.id, { lastLogin: new Date() });
        const tokens = await this.issueTokens(user);
        return {
            ...tokens,
            user: await this.buildUserResponse(user),
        };
    }
    async verifyTwoFactorLogin(userId, code) {
        const user = await this.findUserWithPasswordById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('Utente non trovato');
        }
        if (user.twoFactorCode !== code ||
            user.twoFactorCodePurpose !== 'login' ||
            !user.twoFactorCodeExpires ||
            user.twoFactorCodeExpires.getTime() < Date.now()) {
            throw new common_1.UnauthorizedException('Codice 2FA non valido');
        }
        user.twoFactorCode = null;
        user.twoFactorCodePurpose = null;
        user.twoFactorCodeExpires = null;
        user.lastLogin = new Date();
        await this.userRepository.save(user);
        const tokens = await this.issueTokens(user);
        return {
            ...tokens,
            user: await this.buildUserResponse(user),
        };
    }
    async getProfile(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Utente non trovato');
        }
        const { password, ...result } = user;
        return result;
    }
    async changePassword(userId, dto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('Utente non trovato');
        }
        const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Password attuale non valida');
        }
        user.password = await bcrypt.hash(dto.newPassword, 10);
        user.tokenVersion = (user.tokenVersion ?? 0) + 1;
        await this.userRepository.save(user);
        const tokens = await this.issueTokens(user);
        return {
            ...tokens,
            user: await this.buildUserResponse(user),
        };
    }
    async requestPasswordReset(email) {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await this.findUserWithPasswordByEmail(normalizedEmail);
        if (!user) {
            throw new common_1.UnauthorizedException('Email non trovata');
        }
        const token = `${this.generateTwoFactorCode()}-${Math.random().toString(36).slice(2, 10)}`;
        user.twoFactorCode = token;
        user.twoFactorCodePurpose = 'password_reset';
        user.twoFactorCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
        await this.userRepository.save(user);
        await this.sendPasswordResetCode(user.email, token);
        return { success: true };
    }
    async confirmPasswordReset(email, token, newPassword) {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await this.findUserWithPasswordByEmail(normalizedEmail);
        if (!user) {
            throw new common_1.UnauthorizedException('Email non trovata');
        }
        if (user.twoFactorCode !== token ||
            user.twoFactorCodePurpose !== 'password_reset' ||
            !user.twoFactorCodeExpires ||
            user.twoFactorCodeExpires.getTime() < Date.now()) {
            throw new common_1.UnauthorizedException('Codice non valido o scaduto');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        user.tokenVersion = (user.tokenVersion ?? 0) + 1;
        user.twoFactorCode = null;
        user.twoFactorCodePurpose = null;
        user.twoFactorCodeExpires = null;
        user.refreshTokenHash = null;
        user.refreshTokenExpiresAt = null;
        await this.userRepository.save(user);
        return { success: true };
    }
    async refreshToken(userId, refreshToken) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('Utente non trovato');
        }
        if (!user.refreshTokenHash || !user.refreshTokenExpiresAt) {
            throw new common_1.UnauthorizedException('Refresh token non valido');
        }
        if (user.refreshTokenExpiresAt.getTime() < Date.now()) {
            user.refreshTokenHash = null;
            user.refreshTokenExpiresAt = null;
            await this.userRepository.save(user);
            throw new common_1.UnauthorizedException('Refresh token scaduto');
        }
        const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Refresh token non valido');
        }
        const tokens = await this.issueTokens(user);
        return {
            ...tokens,
            user: await this.buildUserResponse(user),
        };
    }
    async logoutAll(userId) {
        await this.userRepository.increment({ id: userId }, 'tokenVersion', 1);
        await this.userRepository.update(userId, {
            refreshTokenHash: null,
            refreshTokenExpiresAt: null,
        });
        return { success: true };
    }
    async getSettings(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('Utente non trovato');
        }
        return {
            settings: user.settings,
            telefono: user.telefono,
            twoFactorEnabled: user.twoFactorEnabled,
            twoFactorChannel: user.twoFactorChannel,
        };
    }
    async updateSettings(userId, dto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('Utente non trovato');
        }
        const { telefono, ...settings } = dto;
        user.settings = { ...(user.settings || {}), ...settings };
        if (telefono !== undefined) {
            user.telefono = telefono || null;
        }
        await this.userRepository.save(user);
        return {
            settings: user.settings,
            telefono: user.telefono,
            twoFactorEnabled: user.twoFactorEnabled,
            twoFactorChannel: user.twoFactorChannel,
        };
    }
    async requestTwoFactorEnable(userId, channel, telefono) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('Utente non trovato');
        }
        if (channel === 'sms') {
            const phone = telefono || user.telefono;
            if (!phone) {
                throw new common_1.BadRequestException('Numero di telefono mancante');
            }
            user.telefono = phone;
        }
        const code = this.generateTwoFactorCode();
        user.twoFactorCode = code;
        user.twoFactorCodePurpose = 'enable';
        user.twoFactorCodeExpires = new Date(Date.now() + 5 * 60 * 1000);
        user.twoFactorChannel = channel;
        await this.userRepository.save(user);
        const destination = channel === 'sms' ? user.telefono : user.email;
        await this.sendTwoFactorCode(channel, destination, code);
        return { success: true };
    }
    async verifyTwoFactorEnable(userId, code) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('Utente non trovato');
        }
        if (user.twoFactorCode !== code ||
            user.twoFactorCodePurpose !== 'enable' ||
            !user.twoFactorCodeExpires ||
            user.twoFactorCodeExpires.getTime() < Date.now()) {
            throw new common_1.UnauthorizedException('Codice 2FA non valido');
        }
        user.twoFactorEnabled = true;
        user.twoFactorCode = null;
        user.twoFactorCodePurpose = null;
        user.twoFactorCodeExpires = null;
        await this.userRepository.save(user);
        return { success: true };
    }
    async requestTwoFactorDisable(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('Utente non trovato');
        }
        if (!user.twoFactorEnabled) {
            return { success: true };
        }
        const channel = (user.twoFactorChannel || 'email');
        const destination = channel === 'sms' ? user.telefono : user.email;
        if (!destination) {
            throw new common_1.BadRequestException('Canale 2FA non configurato');
        }
        const code = this.generateTwoFactorCode();
        user.twoFactorCode = code;
        user.twoFactorCodePurpose = 'disable';
        user.twoFactorCodeExpires = new Date(Date.now() + 5 * 60 * 1000);
        await this.userRepository.save(user);
        await this.sendTwoFactorCode(channel, destination, code);
        return { success: true };
    }
    async verifyTwoFactorDisable(userId, code) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('Utente non trovato');
        }
        if (user.twoFactorCode !== code ||
            user.twoFactorCodePurpose !== 'disable' ||
            !user.twoFactorCodeExpires ||
            user.twoFactorCodeExpires.getTime() < Date.now()) {
            throw new common_1.UnauthorizedException('Codice 2FA non valido');
        }
        user.twoFactorEnabled = false;
        user.twoFactorChannel = null;
        user.twoFactorCode = null;
        user.twoFactorCodePurpose = null;
        user.twoFactorCodeExpires = null;
        await this.userRepository.save(user);
        return { success: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map