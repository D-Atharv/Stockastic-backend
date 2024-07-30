import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface JwtPayload {
    userId: number,
    role: string
}
export const adminAuthorization = (req: Request, resp: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
        return resp.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        if (decoded.role !== "ADMIN") {
            return resp.status(403).json({ error: "Access denied. You are not an admin." });
        }
        req.user = decoded; // Attach user to request
        next();
    }
    catch (error) {
        resp.status(400).json({ error: "Invalid token." });
    }
}