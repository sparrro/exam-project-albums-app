import db from "../../database/index";
import { sendResponse, sendError } from "../../responses/index";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { checkPassword } from "../../utils/bcrypt";
import { giveToken } from "../../utils/jwt";

exports.handler = async (event: any) => {
    const { username, password } = JSON.parse(event.body);

    if (!username || !password) return sendError(406, "Missing login information");

    try {

        const usernameQueryCommand = new QueryCommand({
            TableName: "examProjectUsers",
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username,
            },
        });
        const queryResult = await db.send(usernameQueryCommand);
        let user;
        if (!queryResult || queryResult.Items?.length==0) {
            return sendError(404, "Account not found")
        } else {
            user = queryResult.Items![0]
        };

        const passwordMatches = await checkPassword(password, user.password);
        if (!passwordMatches) return sendError(401, "Incorrect password");

        const token = await giveToken(user.username);
        return sendResponse(200, true, "Login succesful", {token: token});
        

    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }
}