import { Request, Response } from "express";
import prisma from "../db/prisma";
import { JwtPayload } from "jsonwebtoken";

export const getTeam = async (req: Request, resp: Response) => {
  const user = req.user as JwtPayload;
  const team = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    select: {
      teamId: true,
    },
  });

  if (!team || !team.teamId) {
    return resp.status(404).json({ message: "NO_TEAM" });
  }

  members(req, resp);
};

export const members = async (req: Request, resp: Response) => {
  const user = req.user as JwtPayload;
  const teamUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    select: {
      team: {
        select: {
          id: true,
          teamName: true,
          members: {
            select: {
              name: true,
            },
          },
        },
      }
    }
  });
  console.log(teamUser);
  resp.status(200).json(teamUser);
};

export const joinTeam = async (req: Request, resp: Response) => {
  console.log(req.body);
  const user = req.user as JwtPayload;
  const teamUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    select: {
      id: true,
      teamId: true,
    },
  });
  if (teamUser) {
    if (teamUser.teamId) {
      return resp.status(400).json({
        message: "User already in a team. Leave team to join a new team",
      });
    } else {
      const teamToJoin = await prisma.team.findUnique({
        where: {
          teamName: req.body.teamName
        },
        select: {
          id: true
        }
      })
      if (teamToJoin) {
        const updateUser = await prisma.user.update({
          where: {
            id: teamUser.id,
          },
          data: {
            teamId: teamToJoin.id,
          },
        });
        members(req, resp);
      } else {
        return resp.status(400).json({
          message: "Team does not exist",
        });
      }
    }
  } else {
    return resp.status(403).json({
      message: "User does not exist"
    });
  }
};

export const createTeam = async (req: Request, resp: Response) => {
  console.log(req.body);
  try {
    const team = await prisma.team.create({
      data: {
        teamName: req.body.teamName,
      },
    });

    console.log(team);

    const portfolio = await prisma.portfolio.create({
      data: {
        teamId: team.id,
      },
    });

    req.body = {
      teamName: team.teamName,
    };
    joinTeam(req, resp);
  } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Error in signup controller", error.message);

        // Prisma unique constraint violation
        if (error.message.includes("Unique constraint failed on the fields")) {
          if (error.message.includes("teamName")) {
            return resp.status(400).json({ message: "Team name already exists" });
          }
        }
        return resp.status(500).json({ error: "Internal Server Error" });
      }
    }
  };

  export const leaveTeam = async (req: Request, resp: Response) => {
    const user = req.user as JwtPayload;

    const teamUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        team: {
          select: {
            id: true,
          },
        },
      },
    });

    console.log(teamUser);
    return resp.send("hehehe");
  };
