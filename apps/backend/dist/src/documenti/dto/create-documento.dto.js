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
exports.CreateDocumentoDto = void 0;
const class_validator_1 = require("class-validator");
const no_special_chars_decorator_1 = require("../../common/validators/no-special-chars.decorator");
class CreateDocumentoDto {
    studioId;
    nome;
    descrizione;
    percorsoFile;
    nomeOriginale;
    estensione;
    tipo;
    dimensione;
    caricatoDa;
    praticaId;
    cartellaId;
}
exports.CreateDocumentoDto = CreateDocumentoDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", Object)
], CreateDocumentoDto.prototype, "studioId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateDocumentoDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateDocumentoDto.prototype, "descrizione", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDocumentoDto.prototype, "percorsoFile", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateDocumentoDto.prototype, "nomeOriginale", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDocumentoDto.prototype, "estensione", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['pdf', 'word', 'excel', 'immagine', 'csv', 'xml', 'altro']),
    __metadata("design:type", String)
], CreateDocumentoDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDocumentoDto.prototype, "dimensione", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateDocumentoDto.prototype, "caricatoDa", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDocumentoDto.prototype, "praticaId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDocumentoDto.prototype, "cartellaId", void 0);
//# sourceMappingURL=create-documento.dto.js.map