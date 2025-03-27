import { GetCommand } from "@aws-sdk/lib-dynamodb";
import db from "../../database/index";
import { sendError, sendResponse } from "../../responses";

export const handler = async (event: any) => {
    const albumId = event.queryStringParameters.albumId;

    try {
        const albumGetCommand = new GetCommand({
            TableName: "examProjectAlbums",
            Key: { albumId },
        });
        const albumGetResult = await db.send(albumGetCommand);
        const album = albumGetResult.Item;
        const withCorrectSets = {
            ...album,
            addedBy: [...album!.addedBy],
        }
        return sendResponse(200, true, "Album retrieved", withCorrectSets);
    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }
}