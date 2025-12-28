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
exports.UpdateTicketDto = void 0;
const class_validator_1 = require("class-validator");
const no_special_chars_decorator_1 = require("../../common/validators/no-special-chars.decorator");
class UpdateTicketDto {
    oggetto;
    descrizione;
    priorita;
    stato;
}
exports.UpdateTicketDto = UpdateTicketDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "oggetto", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, no_special_chars_decorator_1.NoSpecialChars)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "descrizione", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['bassa', 'normale', 'alta', 'urgente']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "priorita", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['aperto', 'in_gestione', 'chiuso']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "stato", void 0);
//# sourceMappingURL=update-ticket.dto.js.map