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
exports.CreateMovimentoFinanziarioDto = void 0;
const class_validator_1 = require("class-validator");
const no_special_chars_decorator_1 = require("../common/validators/no-special-chars.decorator");
class CreateMovimentoFinanziarioDto {
    studioId;
    praticaId;
    tipo;
    importo;
    data;
    oggetto;
}
exports.CreateMovimentoFinanziarioDto = CreateMovimentoFinanziarioDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", Object)
], CreateMovimentoFinanziarioDto.prototype, "studioId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateMovimentoFinanziarioDto.prototype, "praticaId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)([
        'capitale',
        'anticipazione',
        'compenso',
        'interessi',
        'recupero_capitale',
        'recupero_anticipazione',
        'recupero_compenso',
        'recupero_interessi',
    ]),
    __metadata("design:type", String)
], CreateMovimentoFinanziarioDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMovimentoFinanziarioDto.prototype, "importo", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMovimentoFinanziarioDto.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], CreateMovimentoFinanziarioDto.prototype, "oggetto", void 0);
//# sourceMappingURL=create-movimento-finanziario.dto.js.map