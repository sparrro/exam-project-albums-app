"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = __importDefault(require("@middy/core"));
const middy_1 = require("../../middy");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const database_1 = __importDefault(require("../../database"));
const responses_1 = require("../../responses");
const getUserHandler = async (event) => {
    const username = event.token.user;
    try {
        const tagsQueryCommand = new lib_dynamodb_1.QueryCommand({
            TableName: "examProjectTags",
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username,
            },
        });
        const tagsQueryResult = await database_1.default.send(tagsQueryCommand);
        const userTags = tagsQueryResult.Items.map(item => {
            return {
                ...item,
                tags: item.tags ? (Array.isArray(item.tags) ? [...item.tags] : Array.from(item.tags)) : [],
            };
        });
        return (0, responses_1.sendResponse)(200, true, "User retrieved", userTags);
    }
    catch (error) {
        console.error(error);
        return (0, responses_1.sendError)(500, "Server error");
    }
};
exports.handler = (0, core_1.default)(getUserHandler).use(middy_1.authenticate);
