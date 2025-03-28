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
    const { tags } = JSON.parse(event.body);
    try {
        const albumScanCommand = new lib_dynamodb_1.ScanCommand({
            TableName: "examProjectAlbums",
        });
        const albumScanResult = await index_1.default.send(albumScanCommand);
        const albums = albumScanResult.Items;
        const matches = albums?.filter(album => {
            const globalTags = album.globalTags;
            const addedBy = [...album.addedBy];
            if (!addedBy || addedBy.length === 0 || !globalTags)
                return false;
            const majorityOfUsers = Math.ceil(addedBy.length / 2);
            return tags.every((tag) => (globalTags[tag] || 0) >= majorityOfUsers);
        });
        const withCorrectSets = matches.map((item) => {
            return {
                ...item,
                addedBy: item.addedBy ? (Array.isArray(item.addedBy) ? [...item.addedBy] : Array.from(item.addedBy)) : [],
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
