// import { Socket } from 'socket.io';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// const calculateUpdatedPrice = (currentPrice: number, volume: number, stock: any): number => {
//     const randomFluctuation = Math.random() * (stock.upper - stock.lower);
//     const priceChange = volume * currentPrice * 0.001;
//     const newPrice = currentPrice - priceChange + randomFluctuation;
//     return Math.max(stock.lower, Math.min(stock.upper, newPrice));
// };


// const buyStockHandler = (socket: Socket) => {
//     socket.on('buyStock', async (data) => {
//         const { type, company, volume, userId } = data;

//         if (!userId) {
//             socket.emit('buyResponse', { status: 'fail', message: 'User ID not found in request.' });
//             return;
//         }

//         if (!type || !company || !volume || volume <= 0) {
//             socket.emit('buyResponse', { status: 'fail', message: 'Invalid request. Provide type, company, and a valid volume.' });
//             return;
//         }

//         try {
//             const user = await prisma.user.findUnique({
//                 where: { id: parseInt(userId) },
//                 include: { team: true },
//             });

//             if (!user || !user.team) {
//                 socket.emit('buyResponse', { status: 'fail', message: 'User or team not found.' });
//                 return;
//             }

//             let portfolio = await prisma.portfolio.findUnique({
//                 where: { teamId: user.team.id },
//             });

//             if (!portfolio) {
//                 portfolio = await prisma.portfolio.create({
//                     data: {
//                         balance: 1000000,
//                         team: { connect: { id: user.team.id } },
//                     },
//                 });
//             }

//             const stock = await prisma.stock.findUnique({
//                 where: { id: company },
//             });

//             if (!stock) {
//                 socket.emit('buyResponse', { status: 'fail', message: 'Stock not found.' });
//                 return;
//             }

//             if (stock.participantStocks < volume) {
//                 socket.emit('buyResponse', { status: 'fail', message: 'Not enough stock available.' });
//                 return;
//             }

//             const totalPrice = stock.prices * volume;

//             if (portfolio.balance < totalPrice) {
//                 socket.emit('buyResponse', { status: 'fail', message: 'Insufficient balance in the portfolio.' });
//                 return;
//             }

//             const updatedPrice = calculateUpdatedPrice(stock.prices, volume, stock);

//             // Ensure price and volume are non-negative
//             const finalPrice = Math.max(0, updatedPrice);
//             const finalVolume = Math.max(0, volume);

//             await prisma.portfolio.update({
//                 where: { id: portfolio.id },
//                 data: { balance: { decrement: totalPrice } },
//             });

//             await prisma.transaction.create({
//                 data: {
//                     transactionType: 'BUY',
//                     quantity: finalVolume,
//                     price: stock.prices,
//                     portfolioId: portfolio.id,
//                     stockId: stock.id,
//                 },
//             });

//             const existingHolding = await prisma.holdings.findFirst({
//                 where: {
//                     portfolioId: portfolio.id,
//                     stockId: stock.id,
//                 },
//             });

//             if (existingHolding) {
//                 await prisma.holdings.update({
//                     where: { id: existingHolding.id },
//                     data: {
//                         quantity: { increment: finalVolume },
//                         avgPrice: stock.prices,
//                     },
//                 });
//             } else {
//                 await prisma.holdings.create({
//                     data: {
//                         stockId: stock.id,
//                         portfolioId: portfolio.id,
//                         quantity: finalVolume,
//                         avgPrice: stock.prices,
//                     },
//                 });
//             }

//             await prisma.stock.update({
//                 where: { id: stock.id },
//                 data: {
//                     participantStocks: { decrement: finalVolume },
//                     prices: finalPrice,
//                 },
//             });

//             socket.emit('buyResponse', { status: 'success', updatedPrice: finalPrice });
//         } catch (error) {
//             console.error(error);
//             socket.emit('buyResponse', { status: 'fail', message: 'An error occurred while processing the transaction.' });
//         }
//     });
// };

// export default buyStockHandler;
















import { Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const calculateUpdatedPrice = (currentPrice: number, volume: number, stock: any): number => {
    const randomFluctuation = Math.random() * (stock.upper - stock.lower);
    const priceChange = volume * currentPrice * 0.001;
    const newPrice = currentPrice - priceChange + randomFluctuation;
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

            if (stock.participantStocks < volume) {
                socket.emit('buyResponse', { status: 'fail', message: 'Not enough stock available.' });
                return;
            }

            const totalPrice = stock.prices * volume;

            if (portfolio.balance < totalPrice) {
                socket.emit('buyResponse', { status: 'fail', message: 'Insufficient balance in the portfolio.' });
                return;
            }

            const updatedPrice = calculateUpdatedPrice(stock.prices, volume, stock);

            // Ensure price and volume are non-negative
            const finalPrice = Math.max(0, updatedPrice);
            const finalVolume = Math.max(0, volume);

            // Update the portfolio balance
            await prisma.portfolio.update({
                where: { id: portfolio.id },
                data: { balance: { decrement: totalPrice } },
            });

            // Create a transaction
            await prisma.transaction.create({
                data: {
                    transactionType: 'BUY',
                    quantity: finalVolume,
                    price: stock.prices,
                    portfolioId: portfolio.id,
                    stockId: stock.id,
                },
            });

            // Update or create holding
            const existingHolding = await prisma.holdings.findFirst({
                where: {
                    portfolioId: portfolio.id,
                    stockId: stock.id,
                },
            });

            if (existingHolding) {
                // Calculate new wallet balance
                const newWalletBalance = existingHolding.wallet - totalPrice;

                await prisma.holdings.update({
                    where: { id: existingHolding.id },
                    data: {
                        quantity: { increment: finalVolume },
                        avgPrice: stock.prices,
                        wallet: newWalletBalance, // Update wallet balance
                    },
                });
            } else {
                await prisma.holdings.create({
                    data: {
                        stockId: stock.id,
                        portfolioId: portfolio.id,
                        quantity: finalVolume,
                        avgPrice: stock.prices,
                        wallet: portfolio.balance - totalPrice, // Initialize wallet balance
                    },
                });
            }

            await prisma.stock.update({
                where: { id: stock.id },
                data: {
                    participantStocks: { decrement: finalVolume },
                    prices: finalPrice,
                },
            });

            socket.emit('buyResponse', { status: 'success', updatedPrice: finalPrice });
        } catch (error) {
            console.error(error);
            socket.emit('buyResponse', { status: 'fail', message: 'An error occurred while processing the transaction.' });
        }
    });
};


export default buyStockHandler;





