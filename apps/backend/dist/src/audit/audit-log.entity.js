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
exports.AuditLog = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
let AuditLog = class AuditLog {
    id;
    createdAt;
    userId;
    user;
    userEmail;
    userRole;
    action;
    entityType;
    entityId;
    entityName;
    description;
    metadata;
    ipAddress;
    userAgent;
    studioId;
    success;
    errorMessage;
};
exports.AuditLog = AuditLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AuditLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AuditLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", Object)
], AuditLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "userEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "userRole", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: [
            'LOGIN', 'LOGOUT', 'LOGIN_FAILED',
            'CREATE', 'UPDATE', 'DELETE', 'VIEW',
            'TOGGLE_ACTIVE', 'RESET_PASSWORD', 'ASSIGN_STUDIO',
            'UPLOAD_FILE', 'DOWNLOAD_FILE', 'DELETE_FILE',
            'EXPORT_DATA', 'BACKUP_STUDIO', 'IMPORT_DATA'
        ] }),
    __metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: [
            'USER', 'STUDIO', 'CLIENTE', 'DEBITORE', 'PRATICA',
            'AVVOCATO', 'MOVIMENTO_FINANZIARIO', 'ALERT', 'TICKET',
            'DOCUMENTO', 'CARTELLA', 'SYSTEM'
        ] }),
    __metadata("design:type", String)
], AuditLog.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "entityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "entityName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 45, nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "studioId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], AuditLog.prototype, "success", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "errorMessage", void 0);
exports.AuditLog = AuditLog = __decorate([
    (0, typeorm_1.Entity)('audit_logs'),
    (0, typeorm_1.Index)(['createdAt']),
    (0, typeorm_1.Index)(['userId']),
    (0, typeorm_1.Index)(['entityType']),
    (0, typeorm_1.Index)(['action'])
], AuditLog);
//# sourceMappingURL=audit-log.entity.js.map