import { DeleteCommand, GetCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import db from "../../database/index";
import { sendResponse, sendError } from "../../responses/index";
import middy from "@middy/core";
import { authenticate } from "../../middy";

const removeAlbumHandler = async (event: any) => {
    const username = event.token.user;
    const albumId = event.queryStringParameters.albumId;

    try {
        const userQuery = new QueryCommand({
            TableName: "examProjectUsers",
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username,
            },
        });
        const userQueryResult = await db.send(userQuery);
        const user = userQueryResult.Items![0];

        const albums = [...user.albums]

        if (!albums.includes(albumId)) {
            return sendResponse(200, false, "Album already not in library");
        }

        const getUserTagsCommand = new GetCommand({
            TableName: "examProjectTags",
            Key: { username, albumId }
        });
        const userTagsResult = await db.send(getUserTagsCommand);
        const userTags = [...userTagsResult.Item!.tags];

        const removeAlbumCommand = new UpdateCommand({
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

        const removeUserCommand = new UpdateCommand({
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

        const deleteTagsCommand = new DeleteCommand({
            TableName: "examProjectTags",
            Key: { username, albumId },
        });

        const tagUpdatePromises = userTags.map(async (tag: string) => {
            const globalTagsUpdateCommand = new UpdateCommand({
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

            return db.send(globalTagsUpdateCommand).catch(async (error) => {
                if (error.name === "ConditionalCheckFailedException") {
                    const removeTagCommand = new UpdateCommand({
                        TableName: "examProjectAlbums",
                        Key: { albumId },
                        UpdateExpression: "REMOVE #globalTags.#tag",
                        ExpressionAttributeNames: {
                            "#globalTags": "globalTags",
                            "#tag": tag,
                        },
                    });
                    return db.send(removeTagCommand);
                }
            });
        });

        await Promise.all([
            db.send(removeAlbumCommand),
            db.send(removeUserCommand),
            db.send(deleteTagsCommand),
            ...tagUpdatePromises,
        ])

        return sendResponse(200, true, "Album removed from library");

    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }
    
}

export const handler = middy(removeAlbumHandler).use(authenticate);