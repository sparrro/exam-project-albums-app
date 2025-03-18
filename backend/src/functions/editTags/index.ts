import db from "../../database/index";
import { authenticate } from "../../middy";
import middy from "@middy/core";
import { sendResponse, sendError } from "../../responses/index";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const editTagsHandler = async (event: any) => {
    const username = event.token.user;
    const albumId = event.queryStringParameters.albumId;
    const { add, remove } = JSON.parse(event.body);

    try {

        const userGetCommand = new GetCommand({
            TableName: "examProjectUsers",
            Key: { username },
        });
        const userGetResult = await db.send(userGetCommand);
        const userAlbums = new Set([...userGetResult.Item!.albums]);

        if (!userAlbums.has(albumId)) return sendError(403, "Album not in library");

        const tagsGetCommand = new GetCommand({
            TableName: "examProjectTags",
            Key: { username, albumId },
        });
        const tagsGetResult = await db.send(tagsGetCommand);
        const currentTags = new Set(tagsGetResult.Item!.tags);

        const updatedTags = new Set([...currentTags, ...add]);
        remove.forEach((tag: string) => updatedTags.delete(tag));

        const tagsUpdateCommand = new UpdateCommand({
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
        await db.send(tagsUpdateCommand);

        const globalTagUpdates = [
            ...add.map((tag: string) => ({
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
            ...remove.map((tag: string) => ({
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
            return db.send(new UpdateCommand({
                TableName: "examProjectAlbums",
                Key: { albumId },
                ...update,
            })).catch(error => {
                if (error.name === "ConditionalCheckFailedExpression") {
                    return db.send(new UpdateCommand({
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

        return sendResponse(200, true, "Album tags updated");

    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }

}

export const handler = middy(editTagsHandler).use(authenticate);