import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import db from "../../database/index";
import { sendResponse, sendError } from "../../responses/index";

export const handler = async (event: any) => {
    const { tags } = JSON.parse(event.body);

    try {

        const albumScanCommand = new ScanCommand({
            TableName: "examProjectAlbums",
        });
        const albumScanResult = await db.send(albumScanCommand);
        const albums = albumScanResult.Items

        const matches = albums?.filter(album => {
            const globalTags = album.globalTags;
            const addedBy = [...album.addedBy];
            if (!addedBy || addedBy.length === 0 || !globalTags) return false;
            const majorityOfUsers = Math.ceil(addedBy.length/2);
            return tags.every((tag: string) => (globalTags[tag] || 0) >= majorityOfUsers);
        });

        const withCorrectSets = matches!.map((item) => {
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