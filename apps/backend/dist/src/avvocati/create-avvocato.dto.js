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
exports.CreateAvvocatoDto = void 0;
const class_validator_1 = require("class-validator");
const no_special_chars_decorator_1 = require("../common/validators/no-special-chars.decorator");
class CreateAvvocatoDto {
    studioId;
    nome;
    cognome;
    email;
    codiceFiscale;
    telefono;
    livelloAccessoPratiche;
    livelloPermessi;
    note;
}
exports.CreateAvvocatoDto = CreateAvvocatoDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", Object)
], CreateAvvocatoDto.prototype, "studioId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsNotEmpty)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateAvvocatoDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsNotEmpty)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateAvvocatoDto.prototype, "cognome", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAvvocatoDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(16),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateAvvocatoDto.prototype, "codiceFiscale", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateAvvocatoDto.prototype, "telefono", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['solo_proprie', 'tutte']),
    __metadata("design:type", String)
], CreateAvvocatoDto.prototype, "livelloAccessoPratiche", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['visualizzazione', 'modifica']),
    __metadata("design:type", String)
], CreateAvvocatoDto.prototype, "livelloPermessi", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateAvvocatoDto.prototype, "note", void 0);
//# sourceMappingURL=create-avvocato.dto.js.map