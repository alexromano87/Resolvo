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
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ExcelJS = __importStar(require("exceljs"));
const pratica_entity_1 = require("../pratiche/pratica.entity");
const cliente_entity_1 = require("../clienti/cliente.entity");
const debitore_entity_1 = require("../debitori/debitore.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const movimento_finanziario_entity_1 = require("../movimenti-finanziari/movimento-finanziario.entity");
const documento_entity_1 = require("../documenti/documento.entity");
const alert_entity_1 = require("../alerts/alert.entity");
const ticket_entity_1 = require("../tickets/ticket.entity");
const audit_log_entity_1 = require("../audit/audit-log.entity");
const user_entity_1 = require("../users/user.entity");
const export_request_dto_1 = require("./dto/export-request.dto");
let ExportService = class ExportService {
    praticheRepo;
    clientiRepo;
    debitoriRepo;
    avvocatiRepo;
    movimentiRepo;
    documentiRepo;
    alertsRepo;
    ticketsRepo;
    auditLogsRepo;
    usersRepo;
    constructor(praticheRepo, clientiRepo, debitoriRepo, avvocatiRepo, movimentiRepo, documentiRepo, alertsRepo, ticketsRepo, auditLogsRepo, usersRepo) {
        this.praticheRepo = praticheRepo;
        this.clientiRepo = clientiRepo;
        this.debitoriRepo = debitoriRepo;
        this.avvocatiRepo = avvocatiRepo;
        this.movimentiRepo = movimentiRepo;
        this.documentiRepo = documentiRepo;
        this.alertsRepo = alertsRepo;
        this.ticketsRepo = ticketsRepo;
        this.auditLogsRepo = auditLogsRepo;
        this.usersRepo = usersRepo;
    }
    async exportData(dto) {
        const data = await this.fetchData(dto);
        switch (dto.format) {
            case 'csv':
                return this.generateCSV(data);
            case 'xlsx':
                return this.generateExcel(data, dto.entity);
            case 'json':
                return this.generateJSON(data);
            default:
                throw new Error('Formato non supportato');
        }
    }
    async backupStudio(studioId, includeDocuments = true, includeAuditLogs = false) {
        const backup = {
            metadata: {
                studioId,
                exportDate: new Date().toISOString(),
                version: '1.0',
            },
            data: {},
        };
        const pratiche = await this.praticheRepo.find({
            where: { studioId },
            relations: ['cliente', 'debitore', 'avvocati', 'movimentiFinanziari'],
        });
        backup.data.pratiche = pratiche;
        const clienti = await this.clientiRepo.find({
            where: { studioId },
            relations: ['clientiDebitori', 'clientiDebitori.debitore'],
        });
        backup.data.clienti = clienti;
        const debitori = await this.debitoriRepo.find({
            where: { studioId },
        });
        backup.data.debitori = debitori;
        const avvocati = await this.avvocatiRepo.find({
            where: { studioId },
        });
        backup.data.avvocati = avvocati;
        const movimenti = await this.movimentiRepo.find({
            where: { pratica: { studioId } },
            relations: ['pratica'],
        });
        backup.data.movimentiFinanziari = movimenti;
        const alerts = await this.alertsRepo.find({
            where: { pratica: { studioId } },
            relations: ['pratica'],
        });
        backup.data.alerts = alerts;
        const tickets = await this.ticketsRepo.find({
            where: { pratica: { studioId } },
            relations: ['pratica'],
        });
        backup.data.tickets = tickets;
        if (includeDocuments) {
            const documenti = await this.documentiRepo.find({
                where: { pratica: { studioId } },
                relations: ['pratica', 'cartella'],
            });
            backup.data.documenti = this.sanitizeDocumenti(documenti);
        }
        if (includeAuditLogs) {
            const auditLogs = await this.auditLogsRepo.find({
                where: { studioId },
            });
            backup.data.auditLogs = auditLogs;
        }
        const users = await this.usersRepo.find({
            where: { studioId },
        });
        backup.data.users = users.map((u) => ({
            ...u,
            password: undefined,
        }));
        return Buffer.from(JSON.stringify(backup, null, 2), 'utf-8');
    }
    async fetchData(dto) {
        const { entity, studioId, dataInizio, dataFine, includeInactive, searchTerm } = dto;
        const createWhere = (baseWheres, options) => {
            let wheres = baseWheres.map((base) => {
                const where = { ...base };
                if (options.supportsAttivo && includeInactive !== true) {
                    where.attivo = true;
                }
                if (options.dateField && dataInizio && dataFine) {
                    where[options.dateField] = (0, typeorm_2.Between)(new Date(dataInizio), new Date(dataFine));
                }
                return where;
            });
            if (searchTerm && options.searchFields?.length) {
                const term = (0, typeorm_2.Like)(`%${searchTerm}%`);
                wheres = wheres.flatMap((base) => options.searchFields.map((field) => ({
                    ...base,
                    [field]: term,
                })));
            }
            return wheres.length === 1 ? wheres[0] : wheres;
        };
        switch (entity) {
            case export_request_dto_1.ExportEntity.PRATICHE: {
                const where = createWhere(studioId ? [{ studioId }] : [{}], {
                    supportsAttivo: true,
                    dateField: 'createdAt',
                    searchFields: ['riferimentoCredito', 'note'],
                });
                return this.praticheRepo.find({
                    where,
                    relations: ['cliente', 'debitore', 'avvocati'],
                });
            }
            case export_request_dto_1.ExportEntity.CLIENTI: {
                const where = createWhere(studioId ? [{ studioId }] : [{}], {
                    supportsAttivo: true,
                    dateField: 'createdAt',
                    searchFields: ['ragioneSociale', 'email', 'partitaIva', 'codiceFiscale'],
                });
                return this.clientiRepo.find({ where });
            }
            case export_request_dto_1.ExportEntity.DEBITORI: {
                const where = createWhere(studioId ? [{ studioId }] : [{}], {
                    supportsAttivo: true,
                    dateField: 'createdAt',
                    searchFields: ['nome', 'cognome', 'ragioneSociale', 'partitaIva', 'codiceFiscale', 'email', 'pec'],
                });
                return this.debitoriRepo.find({ where });
            }
            case export_request_dto_1.ExportEntity.AVVOCATI: {
                const where = createWhere(studioId ? [{ studioId }] : [{}], {
                    supportsAttivo: true,
                    dateField: 'createdAt',
                    searchFields: ['nome', 'cognome', 'email', 'codiceFiscale'],
                });
                return this.avvocatiRepo.find({ where });
            }
            case export_request_dto_1.ExportEntity.MOVIMENTI_FINANZIARI: {
                const baseWheres = studioId
                    ? [{ studioId }, { pratica: { studioId } }]
                    : [{}];
                const where = createWhere(baseWheres, {
                    dateField: 'data',
                    searchFields: ['oggetto', 'tipo'],
                });
                return this.movimentiRepo.find({
                    where,
                    relations: ['pratica'],
                });
            }
            case export_request_dto_1.ExportEntity.DOCUMENTI: {
                const baseWheres = studioId
                    ? [{ studioId }, { pratica: { studioId } }]
                    : [{}];
                const where = createWhere(baseWheres, {
                    supportsAttivo: true,
                    dateField: 'dataCreazione',
                    searchFields: ['nome', 'descrizione', 'nomeOriginale'],
                });
                const documenti = await this.documentiRepo.find({
                    where,
                    relations: ['pratica', 'cartella'],
                });
                return this.sanitizeDocumenti(documenti);
            }
            case export_request_dto_1.ExportEntity.ALERTS: {
                const baseWheres = studioId
                    ? [{ studioId }, { pratica: { studioId } }]
                    : [{}];
                const where = createWhere(baseWheres, {
                    supportsAttivo: true,
                    dateField: 'dataCreazione',
                    searchFields: ['titolo', 'descrizione'],
                });
                return this.alertsRepo.find({
                    where,
                    relations: ['pratica'],
                });
            }
            case export_request_dto_1.ExportEntity.TICKETS: {
                const baseWheres = studioId
                    ? [{ studioId }, { pratica: { studioId } }]
                    : [{}];
                const where = createWhere(baseWheres, {
                    supportsAttivo: true,
                    dateField: 'dataCreazione',
                    searchFields: ['oggetto', 'descrizione', 'autore'],
                });
                return this.ticketsRepo.find({
                    where,
                    relations: ['pratica'],
                });
            }
            case export_request_dto_1.ExportEntity.AUDIT_LOGS: {
                const where = createWhere(studioId ? [{ studioId }] : [{}], {
                    dateField: 'createdAt',
                    searchFields: ['description', 'userEmail', 'entityName', 'action', 'entityType'],
                });
                return this.auditLogsRepo.find({ where });
            }
            case export_request_dto_1.ExportEntity.USERS: {
                const where = createWhere(studioId ? [{ studioId }] : [{}], {
                    supportsAttivo: true,
                    dateField: 'createdAt',
                    searchFields: ['email', 'nome', 'cognome'],
                });
                const users = await this.usersRepo.find({ where });
                return users.map((u) => ({ ...u, password: undefined }));
            }
            default:
                throw new Error('Entità non supportata');
        }
    }
    generateCSV(data) {
        if (!data || data.length === 0) {
            return Buffer.from('Nessun dato disponibile', 'utf-8');
        }
        const keys = Array.from(new Set(data.flatMap((item) => Object.keys(this.flattenObject(item)))));
        const header = keys.join(',');
        const rows = data.map((item) => {
            const flatItem = this.flattenObject(item);
            return keys
                .map((key) => {
                const value = flatItem[key];
                if (value === null || value === undefined)
                    return '';
                const stringValue = String(value).replace(/"/g, '""');
                return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
            })
                .join(',');
        });
        const csv = [header, ...rows].join('\n');
        return Buffer.from(csv, 'utf-8');
    }
    async generateExcel(data, entityName) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(entityName);
        if (!data || data.length === 0) {
            worksheet.addRow(['Nessun dato disponibile']);
            return Buffer.from(await workbook.xlsx.writeBuffer());
        }
        const flatData = data.map((item) => this.flattenObject(item));
        const columns = Object.keys(flatData[0]).map((key) => ({
            header: key,
            key: key,
            width: 20,
        }));
        worksheet.columns = columns;
        flatData.forEach((item) => {
            worksheet.addRow(item);
        });
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4F46E5' },
        };
        worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };
        return Buffer.from(await workbook.xlsx.writeBuffer());
    }
    generateJSON(data) {
        return Buffer.from(JSON.stringify(data, null, 2), 'utf-8');
    }
    sanitizeDocumenti(documenti) {
        return documenti.map(({ percorsoFile, ...rest }) => rest);
    }
    flattenObject(obj, prefix = '') {
        const flattened = {};
        for (const key in obj) {
            if (!obj.hasOwnProperty(key))
                continue;
            const value = obj[key];
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (value === null || value === undefined) {
                flattened[newKey] = '';
            }
            else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
                Object.assign(flattened, this.flattenObject(value, newKey));
            }
            else if (Array.isArray(value)) {
                flattened[newKey] = value.map((v) => (typeof v === 'object' ? JSON.stringify(v) : v)).join('; ');
            }
            else if (value instanceof Date) {
                flattened[newKey] = value.toISOString();
            }
            else {
                flattened[newKey] = value;
            }
        }
        return flattened;
    }
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pratica_entity_1.Pratica)),
    __param(1, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __param(2, (0, typeorm_1.InjectRepository)(debitore_entity_1.Debitore)),
    __param(3, (0, typeorm_1.InjectRepository)(avvocato_entity_1.Avvocato)),
    __param(4, (0, typeorm_1.InjectRepository)(movimento_finanziario_entity_1.MovimentoFinanziario)),
    __param(5, (0, typeorm_1.InjectRepository)(documento_entity_1.Documento)),
    __param(6, (0, typeorm_1.InjectRepository)(alert_entity_1.Alert)),
    __param(7, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __param(8, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __param(9, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ExportService);
//# sourceMappingURL=export.service.js.map