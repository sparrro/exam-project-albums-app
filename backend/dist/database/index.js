"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({
    region: "eu-north-1"
});
const db = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
exports.default = db;
