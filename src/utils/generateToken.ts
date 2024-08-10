import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (user: { id: number }, resp: Response) => {
  try {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    return token;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
  }
};
