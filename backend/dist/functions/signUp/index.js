"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const index_1 = __importDefault(require("../../database/index"));
const index_2 = require("../../responses/index");
const index_3 = require("../../utils/bcrypt/index");
exports.handler = async (event) => {
    const { username, email, password } = JSON.parse(event.body);
    if (!username || !email || !password)
        return (0, index_2.sendError)(406, "Missing account details");
    try {
        const userNameQueryCommand = new lib_dynamodb_1.QueryCommand({
            TableName: "examProjectUsers",
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username,
            },
        });
        const usernameResult = await index_1.default.send(userNameQueryCommand);
        if ((usernameResult.Items).length > 0)
            return (0, index_2.sendError)(400, "Username already in use");
        const hashedPassword = await (0, index_3.hashPassword)(password);
        const putCommand = new lib_dynamodb_1.PutCommand({
            TableName: "examProjectUsers",
            Item: {
                username: username,
                email: email,
                password: hashedPassword,
                albums: [],
            },
        });
        await index_1.default.send(putCommand);
        return (0, index_2.sendResponse)(201, true, "Account created");
    }
    catch (error) {
        console.error(error);
        return (0, index_2.sendError)(500, "Server error");
    }
};
