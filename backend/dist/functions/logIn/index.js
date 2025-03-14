"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../../database/index"));
const index_2 = require("../../responses/index");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const bcrypt_1 = require("../../utils/bcrypt");
const jwt_1 = require("../../utils/jwt");
exports.handler = async (event) => {
    const { username, password } = JSON.parse(event.body);
    if (!username || !password)
        return (0, index_2.sendError)(406, "Missing login information");
    try {
        const usernameQueryCommand = new lib_dynamodb_1.QueryCommand({
            TableName: "examProjectUsers",
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username,
            },
        });
        const queryResult = await index_1.default.send(usernameQueryCommand);
        let user;
        if (!queryResult || queryResult.Items?.length == 0) {
            return (0, index_2.sendError)(404, "Account not found");
        }
        else {
            user = queryResult.Items[0];
        }
        ;
        const passwordMatches = await (0, bcrypt_1.checkPassword)(password, user.password);
        if (!passwordMatches)
            return (0, index_2.sendError)(401, "Incorrect password");
        const token = await (0, jwt_1.giveToken)(user.username);
        return (0, index_2.sendResponse)(200, true, "Login succesful", { token: token });
    }
    catch (error) {
        console.error(error);
        return (0, index_2.sendError)(500, "Server error");
    }
};
