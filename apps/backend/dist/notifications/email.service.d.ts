import { ConfigService } from '@nestjs/config';
type SendEmailPayload = {
    to: string | string[];
    subject: string;
    text: string;
    html?: string;
};
export declare class EmailService {
    private readonly configService;
    private readonly logger;
    private transporter;
    private from;
    private enabled;
    constructor(configService: ConfigService);
    sendEmail(payload: SendEmailPayload): Promise<void>;
}
export {};
