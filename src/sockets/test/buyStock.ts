import { Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { getUserWithTeam } from '../functions/getUser';
import { getStockByName } from '../functions/getStockByName';
const prisma = new PrismaClient();


export function handleBuyStock(socket: Socket) {

    socket.on("buyStock", async (data) => {
        const { stockId, quantity, stockName, teamId } = data;
        const userId = socket.data.userId;

        if (quantity <= 0) {
            socket.emit('buyStockError', { message: 'Quantity must be greater than zero' });
            return;
        }

        try {
            // Fetch user from session
            const user = await getUserWithTeam(userId);
            if (!user || !user.team || user.team.id !== teamId || !user.team.portfolio) {
                throw new Error('User is not part of the specified team or invalid data provided');
            }

            const team = user.team;
            const portfolio = team.portfolio;

            //Fetching Stock using StockName
            const stock = await getStockByName(stockName);
            if (!stock || !stock.prices.length) {
                throw new Error('Invalid stock data provided');
            }

            const latestPriceData = stock.prices[0];
            const currentPrice = latestPriceData.price;
            const totalCost = currentPrice * quantity;

            if (team.portfolio!.balance < totalCost) {
                throw new Error("Insufficient funds");
            }

            if (stock.participantStocks < quantity) {
                throw new Error("Insufficient shares available");
            }

            //calculating the new price
            const ratioRange = [latestPriceData.lowerRange, latestPriceData.upperRange];
            const ratio = Math.random() * (ratioRange[1] - ratioRange[0]) + ratioRange[0];
            const newPrice = currentPrice + (stock.participantStocks * ratio);

            //Transaction
            await prisma.$transaction(async (tx) => {
                //updating the portfolio balance
                await tx.portfolio.update({
                    where: { id: team.portfolio!.id },
                    data: { balance: { decrement: totalCost } }
                });

                //updating the stock quantity
                await tx.stock.update({
                    where: { id: stockId },
                    data: { participantStocks: { decrement: quantity } }
                })

                //Updating the stocks prices
                await tx.stockPrice.update({        //create or update have to see.
                    where: { id: latestPriceData.id },
                    data: { price: newPrice }
                })

                //creating transcation record
                await tx.transaction.create({
                    data: {
                        portfolioId: portfolio!.id, //portfolio possibly null
                        stockId: stock.id,
                        transactionType: 'BUY',
                        quantity: quantity,
                        price: currentPrice,
                    },
                });
            })

            socket.emit('buyStockSuccess', { message: 'Stock purchased successfully' });


        } catch (error) {
            if (error instanceof Error) {
                socket.emit('buyStockError', { message: error.message });
            } else {
                socket.emit('buyStockError', { message: 'An unknown error occurred' });
            }
        }
    });
}