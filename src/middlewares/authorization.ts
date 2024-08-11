import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  role: string;
}
export const Authorization = (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    return resp
      .status(401)
      .json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET!
    ) as JwtPayload;
    req.user = decoded; // Attach user to request
    next();
  } catch (error) {
    resp.status(400).json({ error: "Invalid token." });
  }
};
