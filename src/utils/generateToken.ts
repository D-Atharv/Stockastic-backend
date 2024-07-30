import jwt from "jsonwebtoken"
import { Response } from "express"

export const generateToken = (userId: string, resp:Response) => {
    try{
        const token = jwt.sign({userId}, process.env.JWT_SECRET!, {expiresIn: "1d"});

        resp.cookie("jwt",token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        })

        return token;

    }catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}