import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import db from "../../database/index";
import { sendResponse, sendError } from "../../responses/index";

export const handler = async (event: any) => {
    const title = event.queryStringParameters.albumTitle;

    try {
        const titleScanCommand = new ScanCommand({
            TableName: "examProjectAlbums",
            FilterExpression: "contains(#titleLower, :title)",
            ExpressionAttributeNames: {
                "#titleLower": "titleLower",
            },
            ExpressionAttributeValues: {
                ":title": title.toLowerCase(),
            },
        });
        const scanResult = await db.send(titleScanCommand);
        const withCorrectSets = scanResult.Items?.map((item) => {
            return {
                ...item,
                addedBy: item.addedBy ? (Array.isArray(item.addedBy) ? [...item.addedBy] : Array.from(item.addedBy)) : [],
            }
        });
        return sendResponse(200, true, "Albums found", withCorrectSets);

    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }
}