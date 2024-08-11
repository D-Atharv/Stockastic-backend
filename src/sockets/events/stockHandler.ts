import { Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const stockHandler = (socket: Socket) => {
    socket.on('getMyStocks', async (userId: number) => {
        try {
            // Fetch the stocks related to the user's team
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    team: {
                        include: {
                            Portfolio: {
                                include: {
                                    transactions: {
                                        include: {
                                            stock: true,
                                        },
                                        orderBy: {
                                            id: 'desc',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (user && user.team && user.team.Portfolio) {
                const transactions = user.team.Portfolio.transactions;
                socket.emit('myStocks', { status: 'success', transactions });
            } else {
                socket.emit('myStocks', { status: 'fail', message: 'No stocks found' });
            }
        } catch (error) {
            console.error(error);
            socket.emit('myStocks', { status: 'fail', message: 'Error fetching stocks' });
        }
    });

    socket.on('transactionUpdate', async (transactionData) => {
        try {
            socket.broadcast.emit('transactionUpdate', transactionData);
        } catch (error) {
            console.error(error);
        }
    });
};

export default stockHandler;
