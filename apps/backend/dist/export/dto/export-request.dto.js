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
exports.BackupStudioDto = exports.ExportRequestDto = exports.ExportEntity = exports.ExportFormat = void 0;
const class_validator_1 = require("class-validator");
var ExportFormat;
(function (ExportFormat) {
    ExportFormat["CSV"] = "csv";
    ExportFormat["XLSX"] = "xlsx";
    ExportFormat["JSON"] = "json";
})(ExportFormat || (exports.ExportFormat = ExportFormat = {}));
var ExportEntity;
(function (ExportEntity) {
    ExportEntity["PRATICHE"] = "pratiche";
    ExportEntity["CLIENTI"] = "clienti";
    ExportEntity["DEBITORI"] = "debitori";
    ExportEntity["AVVOCATI"] = "avvocati";
    ExportEntity["MOVIMENTI_FINANZIARI"] = "movimenti_finanziari";
    ExportEntity["DOCUMENTI"] = "documenti";
    ExportEntity["ALERTS"] = "alerts";
    ExportEntity["TICKETS"] = "tickets";
    ExportEntity["AUDIT_LOGS"] = "audit_logs";
    ExportEntity["USERS"] = "users";
})(ExportEntity || (exports.ExportEntity = ExportEntity = {}));
class ExportRequestDto {
    studioId;
    entity;
    format;
    dataInizio;
    dataFine;
    includeInactive;
    searchTerm;
}
exports.ExportRequestDto = ExportRequestDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportRequestDto.prototype, "studioId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ExportEntity),
    __metadata("design:type", String)
], ExportRequestDto.prototype, "entity", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ExportFormat),
    __metadata("design:type", String)
], ExportRequestDto.prototype, "format", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ExportRequestDto.prototype, "dataInizio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ExportRequestDto.prototype, "dataFine", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ExportRequestDto.prototype, "includeInactive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportRequestDto.prototype, "searchTerm", void 0);
class BackupStudioDto {
    studioId;
    includeDocuments;
    includeAuditLogs;
}
exports.BackupStudioDto = BackupStudioDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BackupStudioDto.prototype, "studioId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BackupStudioDto.prototype, "includeDocuments", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BackupStudioDto.prototype, "includeAuditLogs", void 0);
//# sourceMappingURL=export-request.dto.js.map