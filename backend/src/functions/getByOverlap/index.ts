import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import db from "../../database/index";
import { sendResponse, sendError } from "../../responses/index";

export const handler = async (event: any) => {
    const albumId = event.queryStringParameters.albumId;

    try {

        const albumQueryCommand = new QueryCommand({
            TableName: "examProjectAlbums",
            KeyConditionExpression: "albumId = :albumId",
            ExpressionAttributeValues: {
                ":albumId": albumId,
            },
        });
        const albumQueryResult = await db.send(albumQueryCommand);
        const referenceAlbum = albumQueryResult.Items![0];
        if (!referenceAlbum) return sendError(404, "Album not found");
        const withCorrectSets: any = {
            ...referenceAlbum,
            addedBy: [...referenceAlbum.addedBy],
        }

        const majorityOfUsers = Math.ceil(withCorrectSets.addedBy.length/2);
        const consensusTags = Object.keys(withCorrectSets.globalTags).filter(
            (tag) => withCorrectSets.globalTags[tag] >= majorityOfUsers
        );
        if (consensusTags.length === 0) return sendResponse(200, false, "Not enough data to find similar albums", []);
        
        const albumScanCommand = new ScanCommand({
            TableName: "examProjectAlbums",
        });
        const albumScanResult = await db.send(albumScanCommand);
        const matchingAlbums = albumScanResult.Items!.map(item => {
            return {
                ...item,
                addedBy: [...item.addedBy],
            }
        }).filter((album: any) => {
            return album.albumId != albumId
        }).map((album: any) => {
            const { globalTags } = album;

            let score = 0;

            consensusTags.forEach(tag => {
                Object.entries(globalTags).forEach(([key, value]: any[]) => {
                    if (tag == key) score += value;
                });
            });

            score = score / album.addedBy.length;

            return {
                ...album,
                similarity: score,
            }
        }).sort((a, b) => b.similarity - a.similarity).slice(0, 10);

        return sendResponse(200, true, "Albums found", matchingAlbums);

    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }
}