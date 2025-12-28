"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDebitoreDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_debitore_dto_1 = require("./create-debitore.dto");
class UpdateDebitoreDto extends (0, mapped_types_1.PartialType)(create_debitore_dto_1.CreateDebitoreDto) {
}
exports.UpdateDebitoreDto = UpdateDebitoreDto;
//# sourceMappingURL=update-debitore.dto.js.map