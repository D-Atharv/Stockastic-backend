import { Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fetchWalletHandler = (socket: Socket) => {
    socket.on('fetchWallet', async (userId: number) => {
        try {
            const userID = parseInt(userId.toString());

            const user = await prisma.user.findUnique({
                where: { id: userID },
                include: {
                    team: {
                        include: {
                            Portfolio: true
                        }
                    }
                }
            });

            if (user && user.team) {
                const balance = user.team.Portfolio?.balance;   //possibly null
                socket.emit('walletBalance', { status: 'success', balance });
            } else {
                socket.emit('walletBalance', { status: 'fail', message: 'No team or portfolio found' });
            }
        } catch (error) {
            console.error(error);
            socket.emit('walletBalance', { status: 'fail', message: 'Error fetching wallet balance' });
        }
    });
};

export default fetchWalletHandler;
