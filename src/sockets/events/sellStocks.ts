import { Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { getUserWithTeam } from '../functions/getUser';
import { getStockByName } from '../functions/getStockByName';

const prisma = new PrismaClient();

export function handleSellStock(socket: Socket) {
    socket.on('sellStock', async (data) => {
        const { stockName, teamId, stockId, quantity } = data;
        const userId = socket.data.userId;

        if (quantity <= 0) {
            socket.emit('error', { message: 'Invalid quantity specified' });
            return;
        }

        try {
            //fetch user and team details
            const user = await getUserWithTeam(userId);
            if (!user || !user.team || user.team.id !== teamId || !user.team.portfolio) {
                throw new Error('User is not part of the specified team or invalid data provided');
            }

            // Fetch team and portfolio details
            const team = user.team;
            const portfolio = team.portfolio;


            // Fetch stock details
            const stock = await getStockByName(stockId);

            if (!stock || !stock.prices.length) {
                {
                    throw new Error('Invalid stock data provided');
                }
            }

            if (!team || !team.portfolio || !stock || !stock.prices.length) {
                throw new Error('Invalid data provided');
            }

            const latestPriceData = stock.prices[0]; // an object
            const currentPrice = latestPriceData.price;
            const totalRevenue = currentPrice * quantity;


            // Check if the user has enough stocks to sell
            const portfolioStocks = await prisma.transaction.findMany({
                where: {
                    portfolioId: portfolio!.id, //portfolio possibly null
                    stockId: stock.id,
                    transactionType: 'BUY'
                }
            });

            let totalStockQuantity = portfolioStocks.reduce((acc, transaction) => acc + transaction.quantity, 0);

            if (totalStockQuantity < quantity) {
                throw new Error("Insufficient shares available in portfolio");
            }


            const ratioRange = [latestPriceData.lowerRange, latestPriceData.upperRange];
            const ratio = Math.random() * (ratioRange[1] - ratioRange[0]) + ratioRange[0];
            const newPrice = currentPrice - (stock.participantStocks * ratio);

            // Transaction
            await prisma.$transaction(async (tx) => {
                // Updating the portfolio balance
                await tx.portfolio.update({
                    where: { id: portfolio!.id }, //portfolio possibly null
                    data: { balance: { increment: totalRevenue } }
                });

                // Updating the stock quantity
                await tx.stock.update({
                    where: { id: stockId },
                    data: { participantStocks: { increment: quantity } }
                });

                // Updating the stock price
                await tx.stockPrice.update({
                    where: { id: latestPriceData.id },
                    data: { price: newPrice }
                });

                // Creating transaction record
                await tx.transaction.create({
                    data: {
                        portfolioId: portfolio!.id, //portfolio possibly null
                        stockId: stock.id,
                        transactionType: 'SELL',
                        quantity: quantity,
                        price: currentPrice
                    }
                });
            });

            socket.emit('sellStockSuccess', { message: 'Stock sold successfully' });

        } catch (error) {
            if (error instanceof Error) {
                socket.emit('sellStockError', { message: error.message });
            } else {
                socket.emit('sellStockError', { message: 'An unknown error occurred' });
            }
        }
    });
}