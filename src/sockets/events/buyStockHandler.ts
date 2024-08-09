// handlers/buyStockHandler.ts
import { Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const calculateUpdatedPrice = (currentPrice: number, volume: number, stock: any): number => {
    const priceChange = volume * currentPrice * 0.001;
    const newPrice = currentPrice - priceChange;
    return Math.max(stock.lower, Math.min(stock.upper, newPrice));
};

const buyStockHandler = (socket: Socket) => {
    socket.on('buyStock', async (data) => {
        const { type, company, volume, userId } = data;

        if (!userId) {
            socket.emit('buyResponse', { status: 'fail', message: 'User ID not found in request.' });
            return;
        }

        if (!type || !company || !volume || volume <= 0) {
            socket.emit('buyResponse', { status: 'fail', message: 'Invalid request. Provide type, company, and a valid volume.' });
            return;
        }

        try {
            const user = await prisma.user.findUnique({
                where: { id: parseInt(userId) },
                include: { team: true },
            });

            if (!user || !user.team) {
                socket.emit('buyResponse', { status: 'fail', message: 'User or team not found.' });
                return;
            }

            let portfolio = await prisma.portfolio.findUnique({
                where: { teamId: user.team.id },
            });

            if (!portfolio) {
                portfolio = await prisma.portfolio.create({
                    data: {
                        balance: 1000000,
                        team: { connect: { id: user.team.id } },
                    },
                });
            }

            const stock = await prisma.stock.findUnique({
                where: { id: company },
            });

            if (!stock) {
                socket.emit('buyResponse', { status: 'fail', message: 'Stock not found.' });
                return;
            }

            const totalPrice = stock.prices * volume;

            if (portfolio.balance < totalPrice) {
                socket.emit('buyResponse', { status: 'fail', message: 'Insufficient balance in the portfolio.' });
                return;
            }

            const updatedPrice = calculateUpdatedPrice(stock.prices, volume, stock);

            await prisma.portfolio.update({
                where: { id: portfolio.id },
                data: { balance: { decrement: totalPrice } },
            });

            await prisma.transaction.create({
                data: {
                    transactionType: 'BUY',
                    quantity: volume,
                    price: stock.prices,
                    portfolioId: portfolio.id,
                    stockId: stock.id,
                },
            });

            const existingHolding = await prisma.holdings.findFirst({
                where: {
                    portfolioId: portfolio.id,
                    stockId: stock.id,
                },
            });

            if (existingHolding) {
                await prisma.holdings.update({
                    where: { id: existingHolding.id },
                    data: {
                        quantity: { increment: volume },
                        avgPrice: stock.prices,
                    },
                });
            } else {
                await prisma.holdings.create({
                    data: {
                        stockId: stock.id,
                        portfolioId: portfolio.id,
                        quantity: volume,
                        avgPrice: stock.prices,
                    },
                });
            }

            await prisma.stock.update({
                where: { id: stock.id },
                data: {
                    participantStocks: { decrement: volume },
                    prices: updatedPrice,
                },
            });

            socket.emit('buyResponse', { status: 'success', updatedPrice });
        } catch (error) {
            console.error(error);
            socket.emit('buyResponse', { status: 'fail', message: 'An error occurred while processing the transaction.' });
        }
    });
};

export default buyStockHandler;
