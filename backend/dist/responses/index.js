"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendResponse = void 0;
const sendResponse = (status, success, message, data) => {
    return {
        statusCode: status,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "success": success, "message": message, "data": data }),
    };
};
exports.sendResponse = sendResponse;
const sendError = (status, message) => {
    return {
        statusCode: status,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    };
};
exports.sendError = sendError;
