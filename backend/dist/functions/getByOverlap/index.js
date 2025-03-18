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
    const albumId = event.queryStringParameters.albumId;
    try {
        //hämta skivan
        const albumQueryCommand = new lib_dynamodb_1.QueryCommand({
            TableName: "examProjectAlbums",
            KeyConditionExpression: "albumId = :albumId",
            ExpressionAttributeValues: {
                ":albumId": albumId,
            },
        });
        const albumQueryResult = await index_1.default.send(albumQueryCommand);
        const referenceAlbum = albumQueryResult.Items[0];
        if (!referenceAlbum)
            return (0, index_2.sendError)(404, "Album not found");
        const withCorrectSets = {
            ...referenceAlbum,
            addedBy: [...referenceAlbum.addedBy],
        };
        //filtrera ut konsensustaggar
        const majorityOfUsers = Math.ceil(withCorrectSets.addedBy.length / 2);
        const consensusTags = Object.keys(withCorrectSets.globalTags).filter((tag) => withCorrectSets.globalTags[tag] >= majorityOfUsers);
        if (consensusTags.length === 0)
            return (0, index_2.sendResponse)(200, false, "Not enough data to find similar albums", []);
        const albumScanCommand = new lib_dynamodb_1.ScanCommand({
            TableName: "examProjectAlbums",
        });
        const albumScanResult = await index_1.default.send(albumScanCommand);
        const matchingAlbums = albumScanResult.Items.map(item => {
            return {
                ...item,
                addedBy: [...item.addedBy],
            };
        }).filter((album) => {
            return album.albumId != albumId;
        }).map((album) => {
            const { globalTags } = album;
            let score = 0;
            consensusTags.forEach(tag => {
                Object.entries(globalTags).forEach(([key, value]) => {
                    if (tag == key)
                        score += value;
                });
            });
            score = score / album.addedBy.length;
            return {
                ...album,
                similarity: score,
            };
        });
        return (0, index_2.sendResponse)(200, false, "test", matchingAlbums);
        /* .sort((a, b) => b.matchingTags - a.matchingTags).slice(0, 10);

        return sendResponse(200, true, "Albums found", matchingAlbums); */
    }
    catch (error) {
        console.error(error);
        return (0, index_2.sendError)(500, "Server error");
    }
};
exports.handler = handler;
