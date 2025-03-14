"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.giveToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = require("../../secrets");
const giveToken = async (user) => {
    const secret = await (0, secrets_1.getJwtSecret)();
    return jsonwebtoken_1.default.sign({ user: user }, secret, { expiresIn: "24h" });
};
exports.giveToken = giveToken;
const validateToken = async (token) => {
    const secret = await (0, secrets_1.getJwtSecret)();
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.validateToken = validateToken;
