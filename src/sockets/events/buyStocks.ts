// import { Socket } from 'socket.io';
// import { PrismaClient } from '@prisma/client';
// import { getUserWithTeam } from '../functions/getUser';
// import { getStockByName } from '../functions/getStockByName';

// const prisma = new PrismaClient();

// export function handleBuyStock(socket: Socket) {

//     socket.on("buyStock", async (data) => {
//         // const { stockId, quantity, userId, stockName, teamId, } = data;
//         const { stockId, quantity, stockName, teamId } = data;
//         const userId = data.userId; // Get the authenticated user ID from the socket

//         if (quantity <= 0) {
//             socket.emit('buyStockError', { message: 'Quantity must be greater than zero' });
//             return;
//         }

//         try {
//             // // Fetching User and team info
//             // const user = await prisma.user.findUnique({
//             //     where: { id: userId },
//             //     include: { team: true }
//             // })

//             // if (!user || !user.team) {
//             //     throw new Error('User is not part of any team');
//             // }

//             // //Fetching team && Portfolio details
//             // const team = await prisma.team.findUnique({
//             //     where: { id: teamId },
//             //     include: { portfolio: true }
//             // })

//             // if (!team || !team.portfolio) {
//             //     throw new Error('Invalid team or portfolio data provided');
//             // }





//             // Fetch user from session
//             const user = await getUserWithTeam(userId);
//             if (!user || !user.team || user.team.id !== teamId || !user.team.portfolio) {
//                 throw new Error('User is not part of the specified team or invalid data provided');
//             }

//             const team = user.team;
//             const portfolio = team.portfolio;




//             // // Fetch stock using stockName
//             // const stock = await prisma.stock.findFirst({
//             //     where: { stockName: stockName },
//             //     include: {
//             //         prices: {
//             //             orderBy: { priceDate: 'desc' },
//             //             take: 1,
//             //             select: {
//             //                 price: true,
//             //                 openingPrice: true,
//             //                 lowerRange: true,
//             //                 upperRange: true,
//             //                 id: true
//             //             }
//             //         }
//             //     },
//             // });





//             //Fetching Stock using StockName
//             const stock = await getStockByName(stockName);
//             if (!stock || !stock.prices.length) {
//                 throw new Error('Invalid stock data provided');
//             }

//             const latestPriceData = stock.prices[0]; //an object
//             const currentPrice = latestPriceData.price;
//             const totalCost = currentPrice * quantity;
//             // const totalCost = currentPrice + stock.participantStocks * (ratio);

//             if (team.portfolio!.balance < totalCost) {  //team portfolio can be null. have to see how to solve this
//                 throw new Error("Insufficient funds");
//             }

//             if (stock.participantStocks < quantity) {
//                 throw new Error("Insufficient shares available");
//             }

//             //calculating the new price
//             const ratioRange = [latestPriceData.lowerRange, latestPriceData.upperRange];
//             const ratio = Math.random() * (ratioRange[1] - ratioRange[0]) + ratioRange[0];
//             const newPrice = latestPriceData.openingPrice + (stock.participantStocks * ratio);


//             //Transaction
//             await prisma.$transaction(async (tx) => {
//                 //updating the portfolio balance
//                 await tx.portfolio.update({
//                     where: { id: team.portfolio!.id },       //have to check here. PORTFOLIO CAN BE NULL
//                     data: { balance: { decrement: totalCost } }
//                 });

//                 //updating the stock quantity
//                 await tx.stock.update({
//                     where: { id: stockId },
//                     data: { participantStocks: { decrement: quantity } }
//                 })

//                 //Updating the stocks prices
//                 await tx.stockPrice.update({        //create or update have to see.
//                     where: { id: latestPriceData.id },
//                     data: { price: newPrice }
//                 })





//                 //creating transaction record
//                 // await tx.transaction.create({
//                 //     data: {
//                 //         portfolioId: team.portfolio!.id,
//                 //         stockId: stock.id,
//                 //         transactionType: "BUY",
//                 //         quantity: quantity,
//                 //         price: currentPrice
//                 //     }
//                 // })






//                 //creating transcation record
//                 await tx.transaction.create({
//                     data: {
//                         portfolioId: portfolio!.id, //portfolio possibly null
//                         stockId: stock.id,
//                         transactionType: 'BUY',
//                         quantity: quantity,
//                         price: currentPrice,
//                     },
//                 });
//             })

//             socket.emit('buyStockSuccess', { message: 'Stock purchased successfully' });


//         } catch (error) {
//             if (error instanceof Error) {
//                 socket.emit('buyStockError', { message: error.message });
//             } else {
//                 socket.emit('buyStockError', { message: 'An unknown error occurred' });
//             }
//         }
//     });
// }