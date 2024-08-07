import { Request, Response } from "express";
import prisma from "../db/prisma";
import { JwtPayload } from "jsonwebtoken";

export const getTeam = async (req: Request, resp: Response) => {
    const user = req.user as JwtPayload
    const team = await prisma.user.findUnique({
        where : {
            id: parseInt(user.userId)
        },
        select: {
            teamId: true
        }
    });

    if(!team || !team.teamId) {
        return resp.status(404).send("NO_TEAM");
    }

    const members = await prisma.user.findMany({
        where : {
            teamId: team.teamId
        },
        select: {
            name: true
        }
    });
    console.log(members);

    
    return resp.send("done");
};

export const joinTeam = async (req: Request, resp: Response) => {
    return resp.send("h");
}