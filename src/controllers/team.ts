import { Request, Response } from "express";
import prisma from "../db/prisma";
import { JwtPayload } from "jsonwebtoken";

export const getTeam = async (req: Request, resp: Response) => {
    const user = req.user as JwtPayload
    const team = await prisma.user.findUnique({
        where: {
            id: parseInt(user.userId)
        },
        select: {
            teamId: true
        }
    });

    if (!team || !team.teamId) {
        return resp.status(404).send("NO_TEAM");
    }

    const members = await prisma.user.findMany({
        where: {
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


///

// Get wallet balance
export const getWalletBalance = async (req: Request, res: Response) => {
    try {
        const teamId = req.query.teamId as string;
        const portfolio = await prisma.portfolio.findUnique({
            where: { teamId: parseInt(teamId) },
        });
        if (!portfolio) {
            return res.status(404).json({ status: 'fail', message: 'Portfolio not found' });
        }
        res.json({ status: 'success', team: { wallet: portfolio.balance } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
    }
};