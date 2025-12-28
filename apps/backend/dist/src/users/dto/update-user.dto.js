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
exports.UpdateUserDto = void 0;
const class_validator_1 = require("class-validator");
const no_special_chars_decorator_1 = require("../../common/validators/no-special-chars.decorator");
class UpdateUserDto {
    email;
    password;
    nome;
    cognome;
    telefono;
    ruolo;
    clienteId;
    studioId;
    attivo;
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "cognome", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "telefono", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['admin', 'titolare_studio', 'avvocato', 'collaboratore', 'segreteria', 'cliente']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "ruolo", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "clienteId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "studioId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "attivo", void 0);
//# sourceMappingURL=update-user.dto.js.map