"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidUserInputError = void 0;
class InvalidUserInputError extends Error {
    constructor(...args) {
        super(...args);
        this.code = 422;
        this.name = 'InvalidUserInputError';
        Error.captureStackTrace(this, InvalidUserInputError);
    }
}
exports.InvalidUserInputError = InvalidUserInputError;
//# sourceMappingURL=invalid-user-input-error.js.map