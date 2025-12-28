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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sync_1 = require("csv-parse/sync");
const cliente_entity_1 = require("../clienti/cliente.entity");
const debitore_entity_1 = require("../debitori/debitore.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const movimento_finanziario_entity_1 = require("../movimenti-finanziari/movimento-finanziario.entity");
const documento_entity_1 = require("../documenti/documento.entity");
const alert_entity_1 = require("../alerts/alert.entity");
const ticket_entity_1 = require("../tickets/ticket.entity");
const audit_log_entity_1 = require("../audit/audit-log.entity");
const user_entity_1 = require("../users/user.entity");
const import_request_dto_1 = require("./dto/import-request.dto");
let ImportService = class ImportService {
    clientiRepo;
    debitoriRepo;
    avvocatiRepo;
    praticheRepo;
    movimentiRepo;
    documentiRepo;
    alertsRepo;
    ticketsRepo;
    auditLogsRepo;
    usersRepo;
    constructor(clientiRepo, debitoriRepo, avvocatiRepo, praticheRepo, movimentiRepo, documentiRepo, alertsRepo, ticketsRepo, auditLogsRepo, usersRepo) {
        this.clientiRepo = clientiRepo;
        this.debitoriRepo = debitoriRepo;
        this.avvocatiRepo = avvocatiRepo;
        this.praticheRepo = praticheRepo;
        this.movimentiRepo = movimentiRepo;
        this.documentiRepo = documentiRepo;
        this.alertsRepo = alertsRepo;
        this.ticketsRepo = ticketsRepo;
        this.auditLogsRepo = auditLogsRepo;
        this.usersRepo = usersRepo;
    }
    async importBackup(buffer) {
        const payload = JSON.parse(buffer.toString('utf-8'));
        if (!payload || typeof payload !== 'object' || !payload.data) {
            throw new Error('Formato backup non valido');
        }
        const results = {};
        const errors = [];
        const runImport = async (entity, repo, records, allowedFields, requiredFields, rowOffset = 1) => {
            const result = await this.importRecords(repo, records, {
                allowedFields,
                requiredFields,
                rowOffset,
            });
            results[entity] = result;
            result.errors.forEach((err) => errors.push({ entity, ...err }));
        };
        const data = payload.data;
        if (Array.isArray(data.clienti)) {
            await runImport('clienti', this.clientiRepo, data.clienti, this.clienteFields(), ['ragioneSociale', 'email']);
        }
        if (Array.isArray(data.debitori)) {
            await runImport('debitori', this.debitoriRepo, data.debitori, this.debitoreFields(), ['tipoSoggetto']);
        }
        if (Array.isArray(data.avvocati)) {
            await runImport('avvocati', this.avvocatiRepo, data.avvocati, this.avvocatoFields(), ['nome', 'cognome', 'email']);
        }
        if (Array.isArray(data.users)) {
            await runImport('users', this.usersRepo, data.users, this.userFields(), ['email', 'password', 'nome', 'cognome', 'ruolo']);
        }
        if (Array.isArray(data.pratiche)) {
            await runImport('pratiche', this.praticheRepo, data.pratiche, this.praticaFields(), ['clienteId', 'debitoreId']);
            await this.syncPraticheAvvocati(data.pratiche);
        }
        if (Array.isArray(data.movimentiFinanziari)) {
            await runImport('movimentiFinanziari', this.movimentiRepo, data.movimentiFinanziari, this.movimentoFields(), ['praticaId', 'tipo', 'importo', 'data']);
        }
        if (Array.isArray(data.documenti)) {
            await runImport('documenti', this.documentiRepo, data.documenti, this.documentoFields(), ['nome', 'percorsoFile', 'nomeOriginale', 'estensione', 'tipo', 'dimensione']);
        }
        if (Array.isArray(data.alerts)) {
            await runImport('alerts', this.alertsRepo, data.alerts, this.alertFields(), ['praticaId', 'titolo', 'descrizione', 'destinatario', 'dataScadenza']);
        }
        if (Array.isArray(data.tickets)) {
            await runImport('tickets', this.ticketsRepo, data.tickets, this.ticketFields(), ['oggetto', 'descrizione', 'autore']);
        }
        if (Array.isArray(data.auditLogs)) {
            await runImport('auditLogs', this.auditLogsRepo, data.auditLogs, this.auditLogFields(), ['action', 'entityType']);
        }
        return {
            results,
            errors,
        };
    }
    async importCsv(entity, buffer) {
        const expectedHeaders = entity === import_request_dto_1.ImportCsvEntity.CLIENTI
            ? Object.keys(this.clienteCsvMap())
            : Object.keys(this.debitoreCsvMap());
        const { delimiter, fromLine } = this.detectCsvLayout(buffer, expectedHeaders);
        const rows = (0, sync_1.parse)(buffer.toString('utf-8'), {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            bom: true,
            delimiter,
            from_line: fromLine,
            relax_column_count: true,
        });
        const { records, requiredFields } = entity === import_request_dto_1.ImportCsvEntity.CLIENTI
            ? {
                records: rows.map((row) => this.normalizeCsvRow(row, this.clienteCsvMap())),
                requiredFields: ['ragioneSociale', 'email'],
            }
            : {
                records: rows.map((row) => this.normalizeCsvRow(row, this.debitoreCsvMap())),
                requiredFields: ['tipoSoggetto'],
            };
        const repo = entity === import_request_dto_1.ImportCsvEntity.CLIENTI ? this.clientiRepo : this.debitoriRepo;
        const allowedFields = entity === import_request_dto_1.ImportCsvEntity.CLIENTI ? this.clienteFields() : this.debitoreFields();
        return this.importRecords(repo, records, {
            allowedFields,
            requiredFields,
            rowOffset: 2,
            coerce: true,
        });
    }
    async importRecords(repo, records, options) {
        const result = {
            total: records.length,
            imported: 0,
            skipped: 0,
            errors: [],
        };
        for (let i = 0; i < records.length; i += 1) {
            const raw = records[i];
            const row = i + options.rowOffset;
            const record = this.pickFields(raw, options.allowedFields, options.coerce);
            const missing = options.requiredFields.filter((field) => {
                const value = record[field];
                return value === undefined || value === null || value === '';
            });
            if (missing.length > 0) {
                result.skipped += 1;
                result.errors.push({
                    row,
                    reason: `Campi obbligatori mancanti: ${missing.join(', ')}`,
                });
                continue;
            }
            try {
                await repo.save(record);
                result.imported += 1;
            }
            catch (error) {
                result.skipped += 1;
                result.errors.push({
                    row,
                    reason: error?.message || 'Errore durante l\'import',
                });
            }
        }
        return result;
    }
    pickFields(record, allowed, coerce) {
        const out = {};
        allowed.forEach((field) => {
            if (record[field] === undefined)
                return;
            out[field] = coerce ? this.coerceValue(field, record[field]) : record[field];
        });
        return out;
    }
    coerceValue(field, value) {
        if (value === '')
            return undefined;
        if (field === 'attivo') {
            return String(value).toLowerCase() === 'true' || String(value) === '1';
        }
        if (['dataNascita', 'dataAffidamento', 'dataChiusura', 'dataScadenza', 'data', 'dataCreazione', 'dataAggiornamento'].includes(field)) {
            return value ? new Date(value) : undefined;
        }
        if (['capitale', 'importoRecuperatoCapitale', 'anticipazioni', 'importoRecuperatoAnticipazioni', 'compensiLegali', 'compensiLiquidati', 'interessi', 'interessiRecuperati', 'importo'].includes(field)) {
            const parsed = Number(value);
            return Number.isNaN(parsed) ? value : parsed;
        }
        return value;
    }
    normalizeCsvRow(row, map) {
        const normalized = {};
        Object.entries(row).forEach(([key, value]) => {
            const normalizedKey = this.normalizeHeader(key);
            const target = map[normalizedKey];
            if (target) {
                normalized[target] = value;
            }
        });
        return normalized;
    }
    normalizeHeader(header) {
        return header
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');
    }
    detectCsvLayout(buffer, expectedHeaders) {
        const text = buffer.toString('utf-8');
        const lines = text.split(/\r?\n/).map((line) => line.replace(/^\uFEFF/, ''));
        const expectedSet = new Set(expectedHeaders.map((header) => this.normalizeHeader(header)));
        let bestDelimiter = ',';
        let bestCount = 0;
        let headerLineIndex = 0;
        let bestMatchCount = 0;
        lines.forEach((line, index) => {
            if (!line.trim())
                return;
            [';', ',', '\t'].forEach((delimiter) => {
                if (!line.includes(delimiter))
                    return;
                const parts = line.split(delimiter).map((part) => this.normalizeHeader(part));
                const matchCount = parts.filter((part) => expectedSet.has(part)).length;
                if (matchCount > bestMatchCount) {
                    bestMatchCount = matchCount;
                    bestDelimiter = delimiter;
                    headerLineIndex = index;
                    bestCount = (line.match(new RegExp(`\\${delimiter}`, 'g')) || []).length;
                }
            });
        });
        if (bestMatchCount >= 2) {
            return { delimiter: bestDelimiter, fromLine: headerLineIndex + 1 };
        }
        const sample = lines.filter((line) => line.trim() !== '').slice(0, 5);
        const totals = { ',': 0, ';': 0, '\t': 0 };
        sample.forEach((line) => {
            totals[','] += (line.match(/,/g) || []).length;
            totals[';'] += (line.match(/;/g) || []).length;
            totals['\t'] += (line.match(/\t/g) || []).length;
        });
        if (bestCount === 0) {
            if (totals[';'] === 0 && totals[','] === 0 && totals['\t'] === 0) {
                throw new Error('Separatore CSV non riconosciuto');
            }
        }
        if (totals[';'] >= totals[','] && totals[';'] >= totals['\t']) {
            bestDelimiter = ';';
        }
        else if (totals['\t'] >= totals[','] && totals['\t'] >= totals[';']) {
            bestDelimiter = '\t';
        }
        else {
            bestDelimiter = ',';
        }
        return { delimiter: bestDelimiter, fromLine: 1 };
    }
    clienteCsvMap() {
        return {
            id: 'id',
            attivo: 'attivo',
            studioid: 'studioId',
            ragionesociale: 'ragioneSociale',
            codicefiscale: 'codiceFiscale',
            partitaiva: 'partitaIva',
            sedelegale: 'sedeLegale',
            sedeoperativa: 'sedeOperativa',
            indirizzo: 'indirizzo',
            cap: 'cap',
            citta: 'citta',
            provincia: 'provincia',
            nazione: 'nazione',
            tipologia: 'tipologia',
            referente: 'referente',
            telefono: 'telefono',
            email: 'email',
            pec: 'pec',
        };
    }
    debitoreCsvMap() {
        return {
            id: 'id',
            attivo: 'attivo',
            studioid: 'studioId',
            tiposoggetto: 'tipoSoggetto',
            nome: 'nome',
            cognome: 'cognome',
            codicefiscale: 'codiceFiscale',
            datanascita: 'dataNascita',
            luogonascita: 'luogoNascita',
            ragionesociale: 'ragioneSociale',
            partitaiva: 'partitaIva',
            tipologia: 'tipologia',
            sedelegale: 'sedeLegale',
            sedeoperativa: 'sedeOperativa',
            indirizzo: 'indirizzo',
            cap: 'cap',
            citta: 'citta',
            provincia: 'provincia',
            nazione: 'nazione',
            referente: 'referente',
            telefono: 'telefono',
            email: 'email',
            pec: 'pec',
        };
    }
    async syncPraticheAvvocati(pratiche) {
        for (const pratica of pratiche) {
            if (!pratica?.id || !Array.isArray(pratica.avvocati)) {
                continue;
            }
            const avvocatiIds = pratica.avvocati
                .map((avvocato) => avvocato?.id)
                .filter((id) => Boolean(id));
            if (avvocatiIds.length === 0)
                continue;
            try {
                await this.praticheRepo
                    .createQueryBuilder()
                    .relation(pratica_entity_1.Pratica, 'avvocati')
                    .of(pratica.id)
                    .add(avvocatiIds);
            }
            catch {
            }
        }
    }
    clienteFields() {
        return [
            'id',
            'attivo',
            'studioId',
            'ragioneSociale',
            'codiceFiscale',
            'partitaIva',
            'sedeLegale',
            'sedeOperativa',
            'indirizzo',
            'cap',
            'citta',
            'provincia',
            'nazione',
            'tipologia',
            'referente',
            'telefono',
            'email',
            'pec',
            'configurazioneCondivisione',
            'createdAt',
            'updatedAt',
        ];
    }
    debitoreFields() {
        return [
            'id',
            'attivo',
            'studioId',
            'tipoSoggetto',
            'nome',
            'cognome',
            'codiceFiscale',
            'dataNascita',
            'luogoNascita',
            'ragioneSociale',
            'partitaIva',
            'tipologia',
            'sedeLegale',
            'sedeOperativa',
            'indirizzo',
            'cap',
            'citta',
            'provincia',
            'nazione',
            'referente',
            'telefono',
            'email',
            'pec',
            'createdAt',
            'updatedAt',
        ];
    }
    avvocatoFields() {
        return [
            'id',
            'attivo',
            'studioId',
            'nome',
            'cognome',
            'codiceFiscale',
            'email',
            'telefono',
            'livelloAccessoPratiche',
            'livelloPermessi',
            'note',
            'createdAt',
            'updatedAt',
        ];
    }
    userFields() {
        return [
            'id',
            'email',
            'password',
            'nome',
            'cognome',
            'ruolo',
            'clienteId',
            'studioId',
            'attivo',
            'createdAt',
            'updatedAt',
            'lastLogin',
        ];
    }
    praticaFields() {
        return [
            'id',
            'attivo',
            'clienteId',
            'studioId',
            'debitoreId',
            'faseId',
            'aperta',
            'esito',
            'capitale',
            'importoRecuperatoCapitale',
            'anticipazioni',
            'importoRecuperatoAnticipazioni',
            'compensiLegali',
            'compensiLiquidati',
            'interessi',
            'interessiRecuperati',
            'note',
            'riferimentoCredito',
            'storico',
            'opposizione',
            'pignoramento',
            'dataAffidamento',
            'dataChiusura',
            'dataScadenza',
            'createdAt',
            'updatedAt',
        ];
    }
    movimentoFields() {
        return [
            'id',
            'studioId',
            'praticaId',
            'tipo',
            'importo',
            'data',
            'oggetto',
            'createdAt',
            'updatedAt',
        ];
    }
    documentoFields() {
        return [
            'id',
            'studioId',
            'nome',
            'descrizione',
            'percorsoFile',
            'nomeOriginale',
            'estensione',
            'tipo',
            'dimensione',
            'caricatoDa',
            'praticaId',
            'cartellaId',
            'attivo',
            'dataCreazione',
            'dataAggiornamento',
        ];
    }
    alertFields() {
        return [
            'id',
            'studioId',
            'praticaId',
            'titolo',
            'descrizione',
            'destinatario',
            'modalitaNotifica',
            'dataScadenza',
            'giorniAnticipo',
            'stato',
            'messaggi',
            'attivo',
            'dataCreazione',
            'dataAggiornamento',
            'dataChiusura',
        ];
    }
    ticketFields() {
        return [
            'id',
            'numeroTicket',
            'studioId',
            'praticaId',
            'oggetto',
            'descrizione',
            'autore',
            'categoria',
            'priorita',
            'stato',
            'messaggi',
            'attivo',
            'dataCreazione',
            'dataAggiornamento',
            'dataChiusura',
        ];
    }
    auditLogFields() {
        return [
            'id',
            'createdAt',
            'userId',
            'userEmail',
            'userRole',
            'action',
            'entityType',
            'entityId',
            'entityName',
            'description',
            'metadata',
            'ipAddress',
            'userAgent',
            'studioId',
            'success',
            'errorMessage',
        ];
    }
};
exports.ImportService = ImportService;
exports.ImportService = ImportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __param(1, (0, typeorm_1.InjectRepository)(debitore_entity_1.Debitore)),
    __param(2, (0, typeorm_1.InjectRepository)(avvocato_entity_1.Avvocato)),
    __param(3, (0, typeorm_1.InjectRepository)(pratica_entity_1.Pratica)),
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
], ImportService);
//# sourceMappingURL=import.service.js.map