import { Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const transactionHandler = (socket: Socket) => {
    socket.on('getTransactionHistory', async (userId: number) => {
        try {
            // Fetch the user along with their team's portfolio and transactions
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
                                            id: 'desc', // Sort by transaction ID instead
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
                socket.emit('transactionHistory', { status: 'success', transactions });
            } else {
                socket.emit('transactionHistory', { status: 'fail', message: 'No transactions found' });
            }
        } catch (error) {
            console.error(error);
            socket.emit('transactionHistory', { status: 'fail', message: 'Error fetching transaction history' });
        }
    });
};

export default transactionHandler;
