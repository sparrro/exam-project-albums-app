import middy from "@middy/core"
import { authenticate } from "../../middy"
import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import db from "../../database";
import { sendError, sendResponse } from "../../responses";



const getUserHandler = async (event: any) => {
    const username = event.token.user;
    try {
        const tagsQueryCommand = new QueryCommand({
            TableName: "examProjectTags",
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username,
            },
        });
        const tagsQueryResult = await db.send(tagsQueryCommand);
        const userTags = tagsQueryResult.Items!.map(item => {
            return {
                ...item,
                tags: item.tags ? (Array.isArray(item.tags) ? [...item.tags] : Array.from(item.tags)) : [],
            }
        });

        return sendResponse(200, true, "User retrieved", userTags);
    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }
}

export const handler = middy(getUserHandler).use(authenticate);