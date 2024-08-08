import 'dotenv/config';
import 'dotenv/config';
// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

    const team = await prisma.team.create({
        data: {
            teamName: 'Team Beta',
            teamId: 2,
            Portfolio: {
                create: {
                    balance: 10000.0,
                },
            },
        },
    });

    // Create a User
    await prisma.user.create({
        data: {
            email: 'user@example.com',
            name: 'John Doe',
            password: 'password123', // Ensure you hash passwords in production
            role: 'PARTICIPANT',
            teamId: team.id,
            regNo: 'REG123456',
            phone: '123-456-7890',
        },
    });

    await prisma.user.createMany({
        data:
        {
            email: 'john.doe2022@vitstudent.ac.in',
            name: 'John Doe',
            password: '123',
            role: 'PARTICIPANT',
            regNo: 'REG001',
            phone: '1234567891',
            teamId: null,
        },

    });



}



main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
