"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsupportedError = void 0;
class UnsupportedError extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'UnsupportedError';
        this.code = 500;
        Error.captureStackTrace(this, UnsupportedError);
    }
}
exports.UnsupportedError = UnsupportedError;
//# sourceMappingURL=unsupported-error.js.map