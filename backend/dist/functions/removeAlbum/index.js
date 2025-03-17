"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const index_1 = __importDefault(require("../../database/index"));
const index_2 = require("../../responses/index");
const core_1 = __importDefault(require("@middy/core"));
const middy_1 = require("../../middy");
const removeAlbumHandler = async (event) => {
    const username = event.token.user;
    const albumId = event.queryStringParameters.albumId;
    try {
        const userQuery = new lib_dynamodb_1.QueryCommand({
            TableName: "examProjectUsers",
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username,
            },
        });
        const userQueryResult = await index_1.default.send(userQuery);
        const user = userQueryResult.Items[0];
        const albums = [...user.albums];
        if (!albums.includes(albumId)) {
            return (0, index_2.sendResponse)(200, false, "Album already not in library");
        }
        const getUserTagsCommand = new lib_dynamodb_1.GetCommand({
            TableName: "examProjectTags",
            Key: { username, albumId }
        });
        const userTagsResult = await index_1.default.send(getUserTagsCommand);
        const userTags = [...userTagsResult.Item.tags];
        const removeAlbumCommand = new lib_dynamodb_1.UpdateCommand({
            TableName: "examProjectUsers",
            Key: { username },
            UpdateExpression: "DELETE #albums :album",
            ExpressionAttributeNames: {
                "#albums": "albums",
            },
            ExpressionAttributeValues: {
                ":album": new Set([albumId]),
            },
        });
        const removeUserCommand = new lib_dynamodb_1.UpdateCommand({
            TableName: "examProjectAlbums",
            Key: { albumId },
            UpdateExpression: "DELETE #addedBy :user",
            ExpressionAttributeNames: {
                "#addedBy": "addedBy",
            },
            ExpressionAttributeValues: {
                ":user": new Set([username]),
            }
        });
        const deleteTagsCommand = new lib_dynamodb_1.DeleteCommand({
            TableName: "examProjectTags",
            Key: { username, albumId },
        });
        const tagUpdatePromises = userTags.map(async (tag) => {
            const globalTagsUpdateCommand = new lib_dynamodb_1.UpdateCommand({
                TableName: "examProjectAlbums",
                Key: { albumId },
                UpdateExpression: "SET #globalTags.#tag = #globalTags.#tag - :decrement",
                ConditionExpression: "attribute_exists(#globalTags.#tag) AND #globalTags.#tag > :zero",
                ExpressionAttributeNames: {
                    "#globalTags": "globalTags",
                    "#tag": tag,
                },
                ExpressionAttributeValues: {
                    ":decrement": 1,
                    ":zero": 0,
                }
            });
            return index_1.default.send(globalTagsUpdateCommand).catch(async (error) => {
                if (error.name === "ConditionalCheckFailedException") {
                    const removeTagCommand = new lib_dynamodb_1.UpdateCommand({
                        TableName: "examProjectAlbums",
                        Key: { albumId },
                        UpdateExpression: "REMOVE #globalTags.#tag",
                        ExpressionAttributeNames: {
                            "#globalTags": "globalTags",
                            "#tag": tag,
                        },
                    });
                    return index_1.default.send(removeTagCommand);
                }
            });
        });
        await Promise.all([
            index_1.default.send(removeAlbumCommand),
            index_1.default.send(removeUserCommand),
            index_1.default.send(deleteTagsCommand),
            ...tagUpdatePromises,
        ]);
        return (0, index_2.sendResponse)(200, true, "Album removed from library");
    }
    catch (error) {
        console.error(error);
        return (0, index_2.sendError)(500, "Server error");
    }
};
exports.handler = (0, core_1.default)(removeAlbumHandler).use(middy_1.authenticate);
