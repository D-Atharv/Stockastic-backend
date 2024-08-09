// import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export const buyStock = async (req: Request, res: Response) => {
//     const { type, company, volume, userId } = req.body;

//     if (!userId) {
//         return res.status(401).json({ message: 'User ID not found in req.body' });
//     }

//     console.log({ type, company, volume, userId });

//     // Validate the request body
//     if (!type || !company || !volume || volume <= 0) {
//         return res.status(400).json({ message: 'Invalid request. Provide type, company, and a valid volume.' });
//     }

//     try {
//         // Check if the transaction type is "BUY"
//         if (type !== 'BUY') {
//             return res.status(400).json({ message: 'Unsupported transaction type.' });
//         }

//         // Fetch the user's portfolio
//         const user = await prisma.user.findUnique({
//             where: { id: parseInt(userId) },
//             include: { team: true },
//         });

//         if (!user || !user.team) {
//             return res.status(404).json({ message: 'User or team not found.' });
//         }

//         // Fetch or create the portfolio for the team
//         let portfolio = await prisma.portfolio.findUnique({
//             where: { teamId: user.team.id },
//         });

//         if (!portfolio) {
//             portfolio = await prisma.portfolio.create({
//                 data: {
//                     balance: 1000000, // Assuming a default balance for a new portfolio
//                     team: { connect: { id: user.team.id } },
//                 },
//             });
//         }

//         // Fetch the stock
//         const stock = await prisma.stock.findUnique({
//             where: { id: company },
//         });

//         if (!stock) {
//             return res.status(404).json({ message: 'Stock not found.' });
//         }

//         const totalPrice = stock.prices * volume;

//         if (portfolio.balance < totalPrice) {
//             return res.status(400).json({ message: 'Insufficient balance in the portfolio.' });
//         }

//         // Update the portfolio balance
//         await prisma.portfolio.update({
//             where: { id: portfolio.id },
//             data: { balance: { decrement: totalPrice } },
//         });

//         // Create a transaction record
//         const transaction = await prisma.transaction.create({
//             data: {
//                 transactionType: 'BUY',
//                 quantity: volume,
//                 price: stock.prices,
//                 portfolioId: portfolio.id,
//                 stockId: stock.id,
//             },
//         });

//         // Update or create holdings
//         const existingHolding = await prisma.holdings.findFirst({
//             where: {
//                 portfolioId: portfolio.id,
//                 stockId: stock.id,
//             },
//         });

//         if (existingHolding) {
//             await prisma.holdings.update({
//                 where: { id: existingHolding.id },
//                 data: {
//                     quantity: { increment: volume },
//                     avgPrice: stock.prices, // Update this logic as needed
//                 },
//             });
//         } else {
//             await prisma.holdings.create({
//                 data: {
//                     stockId: stock.id,
//                     portfolioId: portfolio.id,
//                     quantity: volume,
//                     avgPrice: stock.prices,
//                 },
//             });
//         }

//         const updatedPrice = stock.prices - (volume * stock.prices * 0.001); // Adjust the multiplier to fine-tune price change

//         // Decrease the stock's participantStocks
//         await prisma.stock.update({
//             where: { id: stock.id },
//             data: {
//                 participantStocks: { decrement: volume },
//                 prices: stock.prices - (volume * 0.01), // Adjust price based on volume bought, modify logic as needed
//             },
//         });

//         return res.status(200).json({ status: 'success', transaction });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'An error occurred while processing the transaction.', error });
//     }
// };


// import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// const calculateUpdatedPrice = (currentPrice: number, volume: number, stock: any): number => {
//     const priceChange = volume * currentPrice * 0.001;
//     const newPrice = currentPrice - priceChange;
//     return Math.max(stock.lower, Math.min(stock.upper, newPrice));
// };

// export const buyStock = async (req: Request, res: Response) => {
//     const { type, company, volume, userId } = req.body;

//     if (!userId) {
//         return res.status(401).json({ message: 'User ID not found in req.body' });
//     }

//     console.log({ type, company, volume, userId });

//     if (!type || !company || !volume || volume <= 0) {
//         return res.status(400).json({ message: 'Invalid request. Provide type, company, and a valid volume.' });
//     }

//     try {
//         if (type !== 'BUY') {
//             return res.status(400).json({ message: 'Unsupported transaction type.' });
//         }

//         const user = await prisma.user.findUnique({
//             where: { id: parseInt(userId) },
//             include: { team: true },
//         });

//         if (!user || !user.team) {
//             return res.status(404).json({ message: 'User or team not found.' });
//         }

//         let portfolio = await prisma.portfolio.findUnique({
//             where: { teamId: user.team.id },
//         });

//         if (!portfolio) {
//             portfolio = await prisma.portfolio.create({
//                 data: {
//                     balance: 1000000, // Default balance for a new portfolio
//                     team: { connect: { id: user.team.id } },
//                 },
//             });
//         }

//         const stock = await prisma.stock.findUnique({
//             where: { id: company },
//         });

//         if (!stock) {
//             return res.status(404).json({ message: 'Stock not found.' });
//         }

//         const totalPrice = stock.prices * volume;

//         if (portfolio.balance < totalPrice) {
//             return res.status(400).json({ message: 'Insufficient balance in the portfolio.' });
//         }

//         const updatedPrice = calculateUpdatedPrice(stock.prices, volume, stock);

//         await prisma.portfolio.update({
//             where: { id: portfolio.id },
//             data: { balance: { decrement: totalPrice } },
//         });

//         const transaction = await prisma.transaction.create({
//             data: {
//                 transactionType: 'BUY',
//                 quantity: volume,
//                 price: stock.prices,
//                 portfolioId: portfolio.id,
//                 stockId: stock.id,
//             },
//         });

//         const existingHolding = await prisma.holdings.findFirst({
//             where: {
//                 portfolioId: portfolio.id,
//                 stockId: stock.id,
//             },
//         });

//         if (existingHolding) {
//             await prisma.holdings.update({
//                 where: { id: existingHolding.id },
//                 data: {
//                     quantity: { increment: volume },
//                     avgPrice: stock.prices,
//                 },
//             });
//         } else {
//             await prisma.holdings.create({
//                 data: {
//                     stockId: stock.id,
//                     portfolioId: portfolio.id,
//                     quantity: volume,
//                     avgPrice: stock.prices,
//                 },
//             });
//         }

//         await prisma.stock.update({
//             where: { id: stock.id },
//             data: {
//                 participantStocks: { decrement: volume },
//                 prices: updatedPrice,
//             },
//         });

//         return res.status(200).json({ status: 'success', transaction, updatedPrice });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'An error occurred while processing the transaction.', error });
//     }
// };










