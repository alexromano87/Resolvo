"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMovimentoFinanziarioDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_movimento_finanziario_dto_1 = require("./create-movimento-finanziario.dto");
class UpdateMovimentoFinanziarioDto extends (0, mapped_types_1.PartialType)((0, mapped_types_1.OmitType)(create_movimento_finanziario_dto_1.CreateMovimentoFinanziarioDto, ['praticaId'])) {
}
exports.UpdateMovimentoFinanziarioDto = UpdateMovimentoFinanziarioDto;
//# sourceMappingURL=update-movimento-finanziario.dto.js.map