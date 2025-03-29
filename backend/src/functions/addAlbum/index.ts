import { GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import db from "../../database/index";
import { sendResponse, sendError } from "../../responses/index";
import { v4 as uuidv4 } from "uuid";
import middy from "@middy/core";
import { authenticate } from "../../middy";

const addAlbumHandler = async (event: any) => {

    const username = event.token.user;
    const { title, artist, tags } = JSON.parse(event.body);
    let albumId = event.queryStringParameters?.albumId;

    if (!albumId && (!title || !artist)) return sendError(400, "Missing title or artist");

    try {
        let isNewAlbum = false;
        if (!albumId) {
            const albumQuery = new QueryCommand({
                TableName: "examProjectAlbums",
                IndexName: "TitleArtistIndex",
                KeyConditionExpression: "title = :title AND artist = :artist",
                ExpressionAttributeValues: {
                    ":title": title,
                    ":artist": artist
                }
            });

            const albumQueryResult = await db.send(albumQuery);
            const existingAlbum = albumQueryResult.Items?.[0];

            if (existingAlbum) {
                albumId = existingAlbum.albumId;
            } else {
                albumId = uuidv4();
                isNewAlbum = true;

                const globalTags = tags.reduce((acc: Record<string, number>, tag: string) => {
                    acc[tag] = 1;
                    return acc;
                }, {});

                const albumPutCommand = new PutCommand({
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
                await db.send(albumPutCommand);
            }
        }

        const userQuery = new QueryCommand({
            TableName: "examProjectUsers",
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username,
            },
        });
        const userQueryResult = await db.send(userQuery);
        const user = userQueryResult.Items![0];

        if (user?.albums?.has(albumId)) {
            return sendResponse(200, false, "Album already in library")
        }

        if(!user || !user.albums) {
            const initialiseAlbumsCommand = new UpdateCommand({
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
            await db.send(initialiseAlbumsCommand);
        } else {
            const userAlbumUpdateCommand = new UpdateCommand({
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
            await db.send(userAlbumUpdateCommand);
        }

        const albumGetCommand = new GetCommand({
            TableName: "examProjectAlbums",
            Key: { albumId }
        });
        const albumGetResult = await db.send(albumGetCommand);
        const albumTitle = albumGetResult.Item!.title;

        const updateExpression = tags.length > 0
        ? "ADD #tags :newTags SET #title = :title"
        : "SET #title = :title, #tags = :emptySet";
        const expressionAttributeValues = tags.length > 0
        ? {
            ":newTags": new Set(tags),
            ":title": albumTitle,
        }
        : {
            ":title": albumTitle,
            ":emptySet": new Set(),
        }

        const tagsUpdateCommand = new UpdateCommand({
            TableName: "examProjectTags",
            Key: { username, albumId },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: {
                "#tags": "tags",
                "#title": "title",
            },
            ExpressionAttributeValues: expressionAttributeValues
        });
        await db.send(tagsUpdateCommand);

        if (!isNewAlbum) {
            
            const tagUpdatePromises = tags.map((tag: string) => {
                const globalTagsUpdateCommand = new UpdateCommand({
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
                return db.send(globalTagsUpdateCommand);
            });

            const addUserCommand = new UpdateCommand({
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
    
            await Promise.all([...tagUpdatePromises, db.send(addUserCommand)]);
        }

        return sendResponse(201, true, "Album added");
    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }
};

export const handler = middy(addAlbumHandler).use(authenticate);