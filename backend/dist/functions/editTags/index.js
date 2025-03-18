"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const index_1 = __importDefault(require("../../database/index"));
const middy_1 = require("../../middy");
const core_1 = __importDefault(require("@middy/core"));
const index_2 = require("../../responses/index");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const editTagsHandler = async (event) => {
    const username = event.token.user;
    const albumId = event.queryStringParameters.albumId;
    const { add, remove } = JSON.parse(event.body);
    try {
        const userGetCommand = new lib_dynamodb_1.GetCommand({
            TableName: "examProjectUsers",
            Key: { username },
        });
        const userGetResult = await index_1.default.send(userGetCommand);
        const userAlbums = new Set([...userGetResult.Item.albums]);
        if (!userAlbums.has(albumId))
            return (0, index_2.sendError)(403, "Album not in library");
        const tagsGetCommand = new lib_dynamodb_1.GetCommand({
            TableName: "examProjectTags",
            Key: { username, albumId },
        });
        const tagsGetResult = await index_1.default.send(tagsGetCommand);
        const currentTags = new Set(tagsGetResult.Item.tags);
        const updatedTags = new Set([...currentTags, ...add]);
        remove.forEach((tag) => updatedTags.delete(tag));
        const tagsUpdateCommand = new lib_dynamodb_1.UpdateCommand({
            TableName: "examProjectTags",
            Key: { username, albumId },
            UpdateExpression: "SET #tags = :tags",
            ExpressionAttributeNames: {
                "#tags": "tags",
            },
            ExpressionAttributeValues: {
                ":tags": updatedTags,
            },
        });
        await index_1.default.send(tagsUpdateCommand);
        const globalTagUpdates = [
            ...add.map((tag) => ({
                UpdateExpression: "SET #globalTags.#tag = if_not_exists(#globalTags.#tag, :start) + :increment",
                ExpressionAttributeNames: {
                    "#globalTags": "globalTags",
                    "#tag": tag,
                },
                ExpressionAttributeValues: {
                    ":start": 0,
                    ":increment": 1,
                },
            })),
            ...remove.map((tag) => ({
                UpdateExpression: "SET #globalTags.#tag = #globalTags.#tag - :decrement",
                ConditionExpression: "attribute_exists(#globalTags.#tag) AND #globalTags.#tag > :zero",
                ExpressionAttributeNames: {
                    "#globalTags": "globalTags",
                    "#tag": tag,
                },
                ExpressionAttributeValues: {
                    ":decrement": 1,
                    ":zero": 0,
                },
            })),
        ];
        const tagUpdatePromises = globalTagUpdates.map(update => {
            return index_1.default.send(new lib_dynamodb_1.UpdateCommand({
                TableName: "examProjectAlbums",
                Key: { albumId },
                ...update,
            })).catch(error => {
                if (error.name === "ConditionalCheckFailedExpression") {
                    return index_1.default.send(new lib_dynamodb_1.UpdateCommand({
                        TableName: "examProjectAlbums",
                        Key: { albumId },
                        UpdateExpression: "REMOVE #globalTags.#tag",
                        ExpressionAttributeNames: {
                            "#globalTags": "globalTags",
                            "#tag": update.ExpressionAttributeNames["#tag"],
                        },
                    }));
                }
            });
        });
        await Promise.all(tagUpdatePromises);
        return (0, index_2.sendResponse)(200, true, "Album tags updated");
    }
    catch (error) {
        console.error(error);
        return (0, index_2.sendError)(500, "Server error");
    }
};
exports.handler = (0, core_1.default)(editTagsHandler).use(middy_1.authenticate);
