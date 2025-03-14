import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import db from "../../database/index";
import { sendResponse, sendError } from "../../responses/index";
import { hashPassword } from "../../utils/bcrypt/index"

exports.handler = async (event: any) => {
    
    const { username, email, password } = JSON.parse(event.body);
    if (!username || !email || !password) return sendError(406, "Missing account details");

    try {
        
        const userNameQueryCommand = new QueryCommand({
            TableName: "examProjectUsers",
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username,
            },
        });

        const usernameResult = await db.send(userNameQueryCommand);
        if ((usernameResult.Items)!.length>0) return sendError(400, "Username already in use");

        const hashedPassword = await hashPassword(password);
        const putCommand = new PutCommand({
            TableName: "examProjectUsers",
            Item: {
                username: username,
                email: email,
                password: hashedPassword,
                albums: [],
            },
        });
        await db.send(putCommand);

        return sendResponse(201, true, "Account created");

    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }
}