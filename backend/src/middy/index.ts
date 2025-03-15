import { sendError } from "../responses";
import { validateToken } from "../utils/jwt";


export const authenticate = {
    before: async (handler: any) => {
        const authorization = handler.event.headers["authorization"];
        const token = authorization && authorization.split(" ")[1];
        if (!token) return sendError(401, "No valid token provided");

        const validated = await validateToken(token);

        handler.event.token = validated;
    }
}