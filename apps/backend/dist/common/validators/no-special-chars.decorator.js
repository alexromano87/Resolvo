"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoSpecialChars = NoSpecialChars;
const class_validator_1 = require("class-validator");
const NO_SPECIAL_CHARS_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,'/_-]+$/u;
function NoSpecialChars(validationOptions) {
    return (target, propertyKey) => {
        (0, class_validator_1.registerDecorator)({
            name: 'NoSpecialChars',
            target: target.constructor,
            propertyName: propertyKey.toString(),
            options: validationOptions,
            validator: {
                validate(value) {
                    if (value === undefined || value === null || value === '')
                        return true;
                    if (typeof value !== 'string')
                        return false;
                    return NO_SPECIAL_CHARS_REGEX.test(value);
                },
                defaultMessage(args) {
                    return `${args.property} contiene caratteri non consentiti`;
                },
            },
        });
    };
}
//# sourceMappingURL=no-special-chars.decorator.js.map