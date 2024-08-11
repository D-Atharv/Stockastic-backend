import { PrismaClient } from '@prisma/client';
import { Socket } from 'socket.io';

const prisma = new PrismaClient();


export const stockHoldingsHandler = (socket: Socket) => {
    socket.on('getHoldingsByTeam', async (teamId) => {
        try {
            console.log('Received request to get holdings by team:', teamId);

            if (isNaN(teamId)) {
                socket.emit('holdingsResponse', { status: 'fail', err: 'Invalid team ID' });
                return;
            }

            const portfolio = await prisma.portfolio.findUnique({
                where: { teamId },
                include: {
                    Holdings: {
                        include: {
                            stock: true,
                        },
                    },
                },
            });

            if (!portfolio) {
                socket.emit('holdingsResponse', { status: 'fail', err: 'Portfolio not found' });
                return;
            }

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

            socket.emit('holdingsResponse', { status: 'success', holdings });
        } catch (error) {
            console.error('Error fetching holdings:', error);
            socket.emit('holdingsResponse', { status: 'fail', err: 'Internal server error' });
        }
    }

    )
}