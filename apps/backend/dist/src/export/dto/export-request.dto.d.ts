export declare enum ExportFormat {
    CSV = "csv",
    XLSX = "xlsx",
    JSON = "json"
}
export declare enum ExportEntity {
    PRATICHE = "pratiche",
    CLIENTI = "clienti",
    DEBITORI = "debitori",
    AVVOCATI = "avvocati",
    MOVIMENTI_FINANZIARI = "movimenti_finanziari",
    DOCUMENTI = "documenti",
    ALERTS = "alerts",
    TICKETS = "tickets",
    AUDIT_LOGS = "audit_logs",
    USERS = "users"
}
export declare class ExportRequestDto {
    studioId?: string;
    entity: ExportEntity;
    format: ExportFormat;
    dataInizio?: string;
    dataFine?: string;
    includeInactive?: boolean;
    searchTerm?: string;
}
export declare class BackupStudioDto {
    studioId: string;
    includeDocuments?: boolean;
    includeAuditLogs?: boolean;
}
