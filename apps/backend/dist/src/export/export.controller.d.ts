import type { Response } from 'express';
import { ExportService } from './export.service';
import { ExportRequestDto, BackupStudioDto } from './dto/export-request.dto';
import { AuditLogService } from '../audit/audit-log.service';
import type { CurrentUserData } from '../auth/current-user.decorator';
export declare class ExportController {
    private readonly exportService;
    private readonly auditLogService;
    constructor(exportService: ExportService, auditLogService: AuditLogService);
    exportData(user: CurrentUserData, dto: ExportRequestDto, res: Response): Promise<void>;
    backupStudio(user: CurrentUserData, dto: BackupStudioDto, res: Response): Promise<void>;
}
