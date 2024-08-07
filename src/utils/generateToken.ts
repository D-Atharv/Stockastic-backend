import jwt from "jsonwebtoken"
import { Response } from "express"

export const generateToken = (user: { id: number }, resp: Response) => {
    try {
        const token = jwt.sign(
            { userId: user.id.toString() },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );

        resp.cookie("jwt", token, {
            httpOnly: false,
            secure: false,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        })

        return token;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}