import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuditLogService } from './audit-log.service';
export declare class AuditLogInterceptor implements NestInterceptor {
    private readonly auditLogService;
    constructor(auditLogService: AuditLogService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private shouldSkipLogging;
    private parseRequest;
    private extractEntityType;
    private getEntityLabel;
    private extractEntityId;
    private extractEntityName;
    private generateDescription;
    private getClientIp;
}
