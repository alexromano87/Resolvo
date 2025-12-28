"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAvvocatoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_avvocato_dto_1 = require("./create-avvocato.dto");
class UpdateAvvocatoDto extends (0, mapped_types_1.PartialType)(create_avvocato_dto_1.CreateAvvocatoDto) {
}
exports.UpdateAvvocatoDto = UpdateAvvocatoDto;
//# sourceMappingURL=update-avvocato.dto.js.map