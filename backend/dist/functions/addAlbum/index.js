"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const index_1 = __importDefault(require("../../database/index"));
const index_2 = require("../../responses/index");
const uuid_1 = require("uuid");
const core_1 = __importDefault(require("@middy/core"));
const middy_1 = require("../../middy");
const addAlbumHandler = async (event) => {
    const username = event.token.user;
    const { title, artist, tags } = JSON.parse(event.body);
    let albumId = event.queryStringParameters?.albumId;
    try {
        let isNewAlbum = false;
        if (!albumId) {
            const albumQuery = new lib_dynamodb_1.QueryCommand({
                TableName: "examProjectAlbums",
                IndexName: "TitleArtistIndex",
                KeyConditionExpression: "title = :title AND artist = :artist",
                ExpressionAttributeValues: {
                    ":title": title,
                    ":artist": artist
                }
            });
            const albumQueryResult = await index_1.default.send(albumQuery);
            const existingAlbum = albumQueryResult.Items?.[0];
            if (existingAlbum) {
                albumId = existingAlbum.albumId;
            }
            else {
                albumId = (0, uuid_1.v4)();
                isNewAlbum = true;
                const globalTags = tags.reduce((acc, tag) => {
                    acc[tag] = 1;
                    return acc;
                }, {});
                const albumPutCommand = new lib_dynamodb_1.PutCommand({
                    TableName: "examProjectAlbums",
                    Item: {
                        albumId,
                        title,
                        titleLower: title.toLowerCase(),
                        artist,
                        globalTags,
                        addedBy: new Set([username]),
                    },
                    ConditionExpression: "attribute_not_exists(albumId)",
                });
                await index_1.default.send(albumPutCommand);
            }
        }
        const userQuery = new lib_dynamodb_1.QueryCommand({
            TableName: "examProjectUsers",
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username,
            },
        });
        const userQueryResult = await index_1.default.send(userQuery);
        const user = userQueryResult.Items[0];
        if (user?.albums?.has(albumId)) {
            return (0, index_2.sendResponse)(200, false, "Album already in library");
        }
        if (!user || !user.albums) {
            const initialiseAlbumsCommand = new lib_dynamodb_1.UpdateCommand({
                TableName: "examProjectUsers",
                Key: { username },
                UpdateExpression: "SET #albums = :album",
                ExpressionAttributeNames: {
                    "#albums": "albums",
                },
                ExpressionAttributeValues: {
                    ":album": new Set([albumId]),
                },
            });
            await index_1.default.send(initialiseAlbumsCommand);
        }
        else {
            const userAlbumUpdateCommand = new lib_dynamodb_1.UpdateCommand({
                TableName: "examProjectUsers",
                Key: { username },
                UpdateExpression: "ADD #albums :album",
                ExpressionAttributeNames: {
                    "#albums": "albums",
                },
                ExpressionAttributeValues: {
                    ":album": new Set([albumId]),
                }
            });
            await index_1.default.send(userAlbumUpdateCommand);
        }
        const tagsUpdateCommand = new lib_dynamodb_1.UpdateCommand({
            TableName: "examProjectTags",
            Key: { username, albumId },
            UpdateExpression: "ADD #tags :newTags",
            ExpressionAttributeNames: {
                "#tags": "tags",
            },
            ExpressionAttributeValues: {
                ":newTags": new Set(tags),
            }
        });
        await index_1.default.send(tagsUpdateCommand);
        if (!isNewAlbum) {
            const tagUpdatePromises = tags.map((tag) => {
                const globalTagsUpdateCommand = new lib_dynamodb_1.UpdateCommand({
                    TableName: "examProjectAlbums",
                    Key: { albumId },
                    UpdateExpression: "SET #globalTags.#tag = if_not_exists(#globalTags.#tag, :start) + :increment",
                    ExpressionAttributeNames: {
                        "#globalTags": "globalTags",
                        "#tag": tag
                    },
                    ExpressionAttributeValues: {
                        ":start": 0,
                        ":increment": 1
                    },
                });
                return index_1.default.send(globalTagsUpdateCommand);
            });
            const addUserCommand = new lib_dynamodb_1.UpdateCommand({
                TableName: "examProjectAlbums",
                Key: { albumId },
                UpdateExpression: "ADD #addedBy :user",
                ExpressionAttributeNames: {
                    "#addedBy": "addedBy"
                },
                ExpressionAttributeValues: {
                    ":user": new Set([username]),
                },
            });
            await Promise.all([...tagUpdatePromises, index_1.default.send(addUserCommand)]);
        }
        return (0, index_2.sendResponse)(201, true, "Album added or updated");
    }
    catch (error) {
        console.error(error);
        return (0, index_2.sendError)(500, "Server error");
    }
};
exports.handler = (0, core_1.default)(addAlbumHandler).use(middy_1.authenticate);
