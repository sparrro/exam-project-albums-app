"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const responses_1 = require("../responses");
const jwt_1 = require("../utils/jwt");
exports.authenticate = {
    before: async (handler) => {
        const authorization = handler.event.headers["authorization"];
        const token = authorization && authorization.split(" ")[1];
        if (!token)
            return (0, responses_1.sendError)(401, "No valid token provided");
        const validated = await (0, jwt_1.validateToken)(token);
        handler.event.token = validated;
    }
};
