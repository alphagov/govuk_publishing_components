"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBase32HashFromFile = exports.createBase32Hash = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const rfc4648_1 = require("rfc4648");
function createBase32Hash(str) {
    return rfc4648_1.base32.stringify(crypto_1.default.createHash('md5').update(str).digest()).replace(/(=+)$/, '').toLowerCase();
}
exports.createBase32Hash = createBase32Hash;
async function createBase32HashFromFile(file) {
    const content = await fs_1.default.promises.readFile(file, 'utf8');
    return createBase32Hash(content.split('\r\n').join('\n'));
}
exports.createBase32HashFromFile = createBase32HashFromFile;
//# sourceMappingURL=index.js.map