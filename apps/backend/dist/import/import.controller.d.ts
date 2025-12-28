import { ImportService } from './import.service';
import { ImportCsvDto } from './dto/import-request.dto';
import { AuditLogService } from '../audit/audit-log.service';
import type { CurrentUserData } from '../auth/current-user.decorator';
export declare class ImportController {
    private readonly importService;
    private readonly auditLogService;
    constructor(importService: ImportService, auditLogService: AuditLogService);
    importBackup(user: CurrentUserData, file: Express.Multer.File): Promise<{
        results: Record<string, {
            total: number;
            imported: number;
            skipped: number;
            errors: {
                row: number;
                reason: string;
            }[];
        }>;
        errors: {
            entity: string;
            row: number;
            reason: string;
        }[];
    }>;
    importCsv(user: CurrentUserData, dto: ImportCsvDto, file: Express.Multer.File): Promise<{
        total: number;
        imported: number;
        skipped: number;
        errors: {
            row: number;
            reason: string;
        }[];
    }>;
}
