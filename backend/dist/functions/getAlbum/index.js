"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const index_1 = __importDefault(require("../../database/index"));
const index_2 = require("../../responses/index");
const handler = async (event) => {
    const title = event.queryStringParameters.albumTitle;
    try {
        const titleScanCommand = new lib_dynamodb_1.ScanCommand({
            TableName: "examProjectAlbums",
            FilterExpression: "contains(#titleLower, :title)",
            ExpressionAttributeNames: {
                "#titleLower": "titleLower",
            },
            ExpressionAttributeValues: {
                ":title": title.toLowerCase(),
            },
        });
        const scanResult = await index_1.default.send(titleScanCommand);
        const withCorrectSets = scanResult.Items?.map((item) => {
            return {
                ...item,
                addedBy: [...item.addedBy],
            };
        });
        return (0, index_2.sendResponse)(200, true, "Albums found", withCorrectSets);
    }
    catch (error) {
        console.error(error);
        return (0, index_2.sendError)(500, "Server error");
    }
};
exports.handler = handler;
