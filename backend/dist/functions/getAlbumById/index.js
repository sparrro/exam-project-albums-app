"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const index_1 = __importDefault(require("../../database/index"));
const responses_1 = require("../../responses");
const handler = async (event) => {
    const albumId = event.queryStringParameters.albumId;
    try {
        const albumGetCommand = new lib_dynamodb_1.GetCommand({
            TableName: "examProjectAlbums",
            Key: { albumId },
        });
        const albumGetResult = await index_1.default.send(albumGetCommand);
        const album = albumGetResult.Item;
        const withCorrectSets = {
            ...album,
            addedBy: album.addedBy ? (Array.isArray(album.addedBy) ? [...album.addedBy] : Array.from(album.addedBy)) : [],
        };
        return (0, responses_1.sendResponse)(200, true, "Album retrieved", withCorrectSets);
    }
    catch (error) {
        console.error(error);
        return (0, responses_1.sendError)(500, "Server error");
    }
};
exports.handler = handler;
