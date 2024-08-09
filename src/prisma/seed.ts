import { PrismaClient, Role, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Seed a team
    const team = await prisma.team.create({
        data: {
            teamName: 'Alpha Team',
            Portfolio: {
                create: {
                    balance: 10000,
                },
            },
        },
    });

    // Update the existing user to associate with the new team
    await prisma.user.update({
        where: {
            email: 'atharv.dewangan2022@vitstudent.ac.in',
        },
        data: {
            name: 'Atharv Dewangan',
            role: Role.PARTICIPANT,
            regNo: '22BCE2022',
            phone: '1234567890',
            team: {
                connect: {
                    id: team.id,
                },
            },
        },
    });

    // Seed stocks
    const stock = await prisma.stock.create({
        data: {
            ticker: 'AAPL',
            stockName: 'Apple Inc.',
            participantStocks: 1000,
            promoterStocks: 500,
            prices: 150.0,
            opening: 148.0,
            prevClosing: 149.0,
            lower: 140.0,
            upper: 160.0,
        },
    });

    // // Seed a transaction
    // await prisma.transaction.create({
    //     data: {
    //         transactionType: TransactionType.BUY,
    //         quantity: 10,
    //         price: 150.0,
    //         portfolioId: team.Portfolio.id,
    //         stockId: stock.id,
    //     },
    // });

    // // Seed holdings
    // await prisma.holdings.create({
    //     data: {
    //         portfolioId: team.Portfolio.id,
    //         stockId: stock.id,
    //         quantity: 10,
    //         avgPrice: 150.0,
    //     },
    // });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
