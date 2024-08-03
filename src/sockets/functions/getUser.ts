import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUserWithTeam(userId: number) {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: { team: { include: { portfolio: true } } }
    });
}