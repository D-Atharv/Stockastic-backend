import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// interface AuthenticatedRequest extends Request {
//     user?: {
//         id: number;
//     };
// }
//FOR AUTH USE LATER



export const getHoldingsByTeam = async (req: Request, res: Response) => {
    console.log('Received request to get holdings by team');

    try {
        // Extract teamId from query parameters or request body
        // const teamId = parseInt(req.query.teamId as string, 10);
        const teamId = 1; //later change this
        console.log(`Extracted teamId: ${teamId}`);

        if (isNaN(teamId)) {
            console.log('Invalid teamId provided');
            return res.status(400).json({ status: 'fail', err: 'Invalid team ID' });
        }


        // Retrieve the portfolio associated with the team
        const portfolio = await prisma.portfolio.findUnique({
            where: { teamId },
            include: {
                Holdings: {
                    include: {
                        stock: true, // Include stock details
                    },
                },
            },
        });

        if (!portfolio) {
            console.log('No portfolio found for teamId:', teamId);
            return res.status(404).json({ status: 'fail', err: 'Portfolio not found' });
        }

        // Format the response to include stock details
        const holdings = portfolio.Holdings.map(holding => ({
            stock: {
                id: holding.stock.id,
                ticker: holding.stock.ticker,
                stockName: holding.stock.stockName,
                prices: holding.stock.prices,
            },
            quantity: holding.quantity,
            avgPrice: holding.avgPrice,
            wallet: holding.wallet,
        }));

        console.log('Successfully retrieved holdings:', holdings);
        res.json({ status: 'success', holdings });
    } catch (error) {
        console.error('Error fetching holdings:', error);
        res.status(500).json({ status: 'fail', err: 'Internal server error' });
    }
};



export const sellStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const { type, company, volume } = req.body;
        // const userId = req.user?.id; // Assuming the JWT middleware adds the user to the request

        const userId = 1; // Hardcoded user ID for testing purposes

        if (type.toLowerCase() !== 'sell') {
            res.status(400).json({ status: 'fail', message: 'Invalid operation type' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { team: { include: { Portfolio: true } } },
        });

        if (!user || !user.team || !user.team.Portfolio) {
            res.status(404).json({ status: 'fail', message: 'User, team, or portfolio not found' });
            return;
        }

        const holding = await prisma.holdings.findFirst({
            where: {
                portfolioId: user.team.Portfolio.id,
                stockId: company,
            },
        });

        if (!holding || holding.quantity < volume) {
            res.status(400).json({ status: 'fail', message: 'Insufficient stocks to sell' });
            return;
        }

        const stock = await prisma.stock.findUnique({ where: { id: company } });
        if (!stock) {
            res.status(404).json({ status: 'fail', message: 'Stock not found' });
            return;
        }

        const sellAmount = stock.prices * volume;

        await prisma.holdings.update({
            where: { id: holding.id },
            data: {
                quantity: { decrement: volume },
                wallet: { increment: sellAmount },
            },
        });

        await prisma.portfolio.update({
            where: { id: user.team.Portfolio.id },
            data: { balance: { increment: sellAmount } },
        });

        await prisma.transaction.create({
            data: {
                transactionType: 'SELL',
                quantity: volume,
                price: stock.prices,
                portfolioId: user.team.Portfolio.id,
                stockId: company,
            },
        });

        res.json({ status: 'success', message: 'Stock sold successfully' });
    } catch (error) {
        console.error('Error selling stock:', error);
        res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
};