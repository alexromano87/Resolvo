"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePraticaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_pratica_dto_1 = require("./create-pratica.dto");
class UpdatePraticaDto extends (0, mapped_types_1.PartialType)(create_pratica_dto_1.CreatePraticaDto) {
}
exports.UpdatePraticaDto = UpdatePraticaDto;
//# sourceMappingURL=update-pratica.dto.js.map