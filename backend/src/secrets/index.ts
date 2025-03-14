import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const jwt_secret_name = "exam_jwt";

const client = new SecretsManagerClient({
    region: "eu-north-1",
});

export const getJwtSecret = (async (): Promise<string> => {
    try {
        const jwtResponse = await client.send(
            new GetSecretValueCommand({
                SecretId: jwt_secret_name,
                VersionStage: "AWSCURRENT",
            })
        );
        return jwtResponse.SecretString!;
    } catch (error) {
        throw error;
    }
})