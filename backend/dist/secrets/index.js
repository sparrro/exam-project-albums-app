"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSecret = void 0;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const jwt_secret_name = "exam_jwt";
const client = new client_secrets_manager_1.SecretsManagerClient({
    region: "eu-north-1",
});
exports.getJwtSecret = (async () => {
    try {
        const jwtResponse = await client.send(new client_secrets_manager_1.GetSecretValueCommand({
            SecretId: jwt_secret_name,
            VersionStage: "AWSCURRENT",
        }));
        return jwtResponse.SecretString;
    }
    catch (error) {
        throw error;
    }
});
