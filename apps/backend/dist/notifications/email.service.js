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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
let EmailService = EmailService_1 = class EmailService {
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    transporter = null;
    from = null;
    enabled = false;
    constructor(configService) {
        this.configService = configService;
        const host = this.configService.get('SMTP_HOST');
        const port = Number(this.configService.get('SMTP_PORT', '587'));
        const user = this.configService.get('SMTP_USER');
        const pass = this.configService.get('SMTP_PASS');
        const secure = this.configService.get('SMTP_SECURE', 'false') === 'true';
        const from = this.configService.get('SMTP_FROM');
        if (!host || !from) {
            this.logger.warn('SMTP non configurato. Invio email disabilitato.');
            return;
        }
        this.from = from;
        this.transporter = nodemailer_1.default.createTransport({
            host,
            port,
            secure,
            auth: user ? { user, pass } : undefined,
        });
        this.enabled = true;
    }
    async sendEmail(payload) {
        if (!this.enabled || !this.transporter || !this.from) {
            this.logger.debug(`Email saltata: ${payload.subject}`);
            return;
        }
        const recipients = Array.isArray(payload.to) ? payload.to.join(', ') : payload.to;
        try {
            await this.transporter.sendMail({
                from: this.from,
                to: recipients,
                subject: payload.subject,
                text: payload.text,
                html: payload.html,
            });
        }
        catch (error) {
            this.logger.error(`Errore invio email: ${payload.subject}`, error);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map