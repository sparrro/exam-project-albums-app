"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPassword = exports.hashPassword = void 0;
const bcryptjs_1 = require("bcryptjs");
const hashPassword = async (password) => {
    return await (0, bcryptjs_1.hash)(password, 10);
};
exports.hashPassword = hashPassword;
const checkPassword = async (password, comparandum) => {
    return await (0, bcryptjs_1.compare)(password, comparandum);
};
exports.checkPassword = checkPassword;
