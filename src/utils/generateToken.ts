import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (user: { id: number }, resp: Response) => {
  try {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    resp.cookie("jwt", token, {
      httpOnly: false,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    resp.cookie('userId', user.id.toString(), {
      httpOnly: false, // Accessible via JavaScript
      // secure: process.env.NODE_ENV === 'production', // Use true in production
      secure: false,
      sameSite: 'strict', // Helps prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration (1 day)
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
