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
exports.CreateClienteDto = void 0;
const class_validator_1 = require("class-validator");
const no_special_chars_decorator_1 = require("../../common/validators/no-special-chars.decorator");
class CreateClienteDto {
    studioId;
    ragioneSociale;
    codiceFiscale;
    partitaIva;
    sedeLegale;
    sedeOperativa;
    indirizzo;
    cap;
    citta;
    provincia;
    nazione;
    tipologia;
    referente;
    referenteNome;
    referenteCognome;
    referenteEmail;
    telefono;
    email;
    pec;
}
exports.CreateClienteDto = CreateClienteDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", Object)
], CreateClienteDto.prototype, "studioId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "ragioneSociale", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(11, 16),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "codiceFiscale", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(11, 11),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "partitaIva", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "sedeLegale", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "sedeOperativa", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "indirizzo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 5),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "cap", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "citta", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 2),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "provincia", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "nazione", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)([
        'impresa_individuale',
        'impresa_individuale_agricola',
        'srl',
        'spa',
        'scpa',
        'srl_agricola',
        'snc',
        'sas',
    ]),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "tipologia", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "referente", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "referenteNome", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "referenteCognome", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "referenteEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "telefono", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "pec", void 0);
//# sourceMappingURL=create-cliente.dto.js.map