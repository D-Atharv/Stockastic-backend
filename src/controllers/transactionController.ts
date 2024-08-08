// // transactionController.ts
// import { Socket } from 'socket.io';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// const handleBuyStock = async (socket: Socket, transaction: any) => {
//     const { companyId, volume, userId } = transaction;

//     try {
//         const stock = await prisma.stock.findUnique({ where: { id: companyId } });

//         if (!stock || stock.volumeAvailable < volume) {
//             socket.emit('error', 'Not enough stock available');
//             return;
//         }

//         await prisma.transaction.create({
//             data: {
//                 type: 'buy',
//                 volume,
//                 user: { connect: { id: userId } },
//                 stock: { connect: { id: companyId } },
//             },
//         });

//         await prisma.stock.update({
//             where: { id: companyId },
//             data: { volumeAvailable: stock.volumeAvailable - volume },
//         });

//         socket.emit('success', 'Transaction successful');
//         socket.broadcast.emit('updateStocks'); // Notify other clients to update their stock data
//     } catch (error) {
//         console.error('Error processing transaction:', error);
//         socket.emit('error', 'Transaction failed');
//     }
// };

// const registerTransactionHandlers = (socket: Socket) => {
//     socket.on('buyStock', (transaction) => handleBuyStock(socket, transaction));
// };

// export default registerTransactionHandlers;
