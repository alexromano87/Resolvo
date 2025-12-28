"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const studio_entity_1 = require("../studi/studio.entity");
let User = class User {
    id;
    email;
    password;
    nome;
    cognome;
    telefono;
    ruolo;
    clienteId;
    studioId;
    attivo;
    tokenVersion;
    twoFactorEnabled;
    twoFactorChannel;
    twoFactorCode;
    twoFactorCodeExpires;
    twoFactorCodePurpose;
    failedLoginAttempts;
    lockoutUntil;
    refreshTokenHash;
    refreshTokenExpiresAt;
    settings;
    createdAt;
    updatedAt;
    lastLogin;
    studio;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "cognome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['admin', 'titolare_studio', 'avvocato', 'collaboratore', 'segreteria', 'cliente'],
        default: 'collaboratore',
    }),
    __metadata("design:type", String)
], User.prototype, "ruolo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "clienteId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "studioId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "attivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "tokenVersion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "twoFactorEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "twoFactorChannel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 12, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "twoFactorCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "twoFactorCodeExpires", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 12, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "twoFactorCodePurpose", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "failedLoginAttempts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "lockoutUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "refreshTokenHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "refreshTokenExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "lastLogin", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => studio_entity_1.Studio, (studio) => studio.users, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'studioId' }),
    __metadata("design:type", Object)
], User.prototype, "studio", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map