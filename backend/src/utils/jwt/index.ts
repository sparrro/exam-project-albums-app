import jwt from "jsonwebtoken"
import { getJwtSecret } from "../../secrets";

export const giveToken = async (user: string) => {

    const secret = await getJwtSecret();

    return jwt.sign(
        {user: user},
        secret,
        {expiresIn: "24h"},
    );
}

export const validateToken = async (token: string) => {
    const secret = await getJwtSecret();
    return jwt.verify(token, secret);
}