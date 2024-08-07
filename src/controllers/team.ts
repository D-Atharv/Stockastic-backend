import { Request, Response } from "express";
import prisma from "../db/prisma";
import { JwtPayload } from "jsonwebtoken";

export const getTeam = async (req: Request, resp: Response) => {
    if (req.user) {
        const user = req.user as JwtPayload
        const team = await prisma.user.findUnique({
            where : {
                id: user.id
            },
            include: {
                team : {
                    select: {
                        members: true
                    }
                }
            }
        });
        console.log(team);
    }

    
    return resp.send("done");
};