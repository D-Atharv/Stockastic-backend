import { Socket, Server } from "socket.io";
import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../utils/tokenBlackList";

interface AuthenticatedSocket extends Socket {
    user?: { id: number, role: string };
}

export const socketAuthMiddleware = (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error("Auth Error: No token provided"));
    }

    if (isTokenBlacklisted(token)) {
        return next(new Error("Auth Error: Token is invalidated"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, role: string };
        socket.user = { id: decoded.userId, role: decoded.role };
        next();
    }
    catch (err) {
        next(new Error("Authentication Error"));
    }
}

