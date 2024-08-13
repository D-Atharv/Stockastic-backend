// import { PrismaClient } from '@prisma/client';
// import { Socket } from 'socket.io';

// const prisma = new PrismaClient();


// export const sellStockHandler = (socket: Socket) => {
//     socket.on('sellStock', async (data) => {
//         try {
//             const { type, company, volume, userId } = data;

//             if (type.toLowerCase() !== 'sell') {
//                 socket.emit('sellResponse', { status: 'fail', message: 'Invalid operation type' });
//                 return;
//             }

//             const user = await prisma.user.findUnique({
//                 where: { id: userId },
//                 include: { team: { include: { Portfolio: true } } },
//             });

//             if (!user || !user.team || !user.team.Portfolio) {
//                 socket.emit('sellResponse', { status: 'fail', message: 'User, team, or portfolio not found' });
//                 return;
//             }

//             const holding = await prisma.holdings.findFirst({
//                 where: {
//                     portfolioId: user.team.Portfolio.id,
//                     stockId: company,
//                 },
//             });

//             if (!holding || holding.quantity < volume) {
//                 socket.emit('sellResponse', { status: 'fail', message: 'Insufficient stocks to sell' });
//                 return;
//             }

//             const stock = await prisma.stock.findUnique({ where: { id: company } });
//             if (!stock) {
//                 socket.emit('sellResponse', { status: 'fail', message: 'Stock not found' });
//                 return;
//             }

//             const sellAmount = stock.prices * volume;

//             await prisma.holdings.update({
//                 where: { id: holding.id },
//                 data: {
//                     quantity: { decrement: volume },
//                     wallet: { increment: sellAmount },
//                 },
//             });

//             await prisma.portfolio.update({
//                 where: { id: user.team.Portfolio.id },
//                 data: { balance: { increment: sellAmount } },
//             });

//             await prisma.transaction.create({
//                 data: {
//                     transactionType: 'SELL',
//                     quantity: volume,
//                     price: stock.prices,
//                     portfolioId: user.team.Portfolio.id,
//                     stockId: company,
//                 },
//             });

//             socket.emit('sellResponse', { status: 'success', message: 'Stock sold successfully' });
//         } catch (error) {
//             console.error('Error selling stock:', error);
//             socket.emit('sellResponse', { status: 'fail', message: 'Internal server error' });
//         }
//     });
// }





















//NEW CODE

import { PrismaClient } from '@prisma/client';
import { Socket, Server } from 'socket.io';

const prisma = new PrismaClient();

export const sellStockHandler = (socket: Socket, io: Server) => {
    socket.on('sellStock', async (data) => {
        try {
            const { type, company, volume, userId } = data;

            if (type.toLowerCase() !== 'sell') {
                socket.emit('sellResponse', { status: 'fail', message: 'Invalid operation type' });
                return;
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: { team: { include: { Portfolio: true } } },
            });

            if (!user || !user.team || !user.team.Portfolio) {
                socket.emit('sellResponse', { status: 'fail', message: 'User, team, or portfolio not found' });
                return;
            }

            const holding = await prisma.holdings.findFirst({
                where: {
                    portfolioId: user.team.Portfolio.id,
                    stockId: company,
                },
            });

            if (!holding || holding.quantity < volume) {
                socket.emit('sellResponse', { status: 'fail', message: 'Insufficient stocks to sell' });
                return;
            }

            const stock = await prisma.stock.findUnique({ where: { id: company } });
            if (!stock) {
                socket.emit('sellResponse', { status: 'fail', message: 'Stock not found' });
                return;
            }

            const sellAmount = stock.prices * volume;

            // Update holdings
            await prisma.holdings.update({
                where: { id: holding.id },
                data: {
                    quantity: { decrement: volume },
                    wallet: { increment: sellAmount },
                },
            });

            // Update portfolio balance
            await prisma.portfolio.update({
                where: { id: user.team.Portfolio.id },
                data: { balance: { increment: sellAmount } },
            });

            // Update stock participant quantity
            await prisma.stock.update({
                where: { id: company },
                data: { participantStocks: { increment: volume } },
            });

            // Create transaction record
            await prisma.transaction.create({
                data: {
                    transactionType: 'SELL',
                    quantity: volume,
                    price: stock.prices,
                    portfolioId: user.team.Portfolio.id,
                    stockId: company,
                },
            });

            // Broadcast updated stock info to all clients
            const updatedStock = await prisma.stock.findUnique({ where: { id: company } });
            io.emit('stockUpdated', { status: 'success', stock: updatedStock });

            socket.emit('sellResponse', { status: 'success', message: 'Stock sold successfully' });
        } catch (error) {
            console.error('Error selling stock:', error);
            socket.emit('sellResponse', { status: 'fail', message: 'Internal server error' });
        }
    });
};
