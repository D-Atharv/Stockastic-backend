import { Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const teamHandler = (socket: Socket) => {
    socket.on('getTeam', async (userId: number) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    team: {
                        include: {
                            members: true,
                        },
                    },
                },
            });

            if (user && user.team) {
                socket.emit('teamData', {
                    status: 'success',
                    team: {
                        name: user.team.teamName,
                        members: user.team.members,
                    },
                });
            } else {
                socket.emit('teamData', { status: 'fail', message: 'Team not found' });
            }
        } catch (error) {
            console.error(error);
            socket.emit('teamData', { status: 'fail', message: 'Error fetching team data' });
        }
    });


    const teamHandler = (socket: Socket) => {
        socket.on('getTotal', async (portfolioId: number) => {
            try {
                // Find the total amount using the portfolio ID
                const totalAmount = await prisma.transaction.aggregate({
                    where: { portfolioId: portfolioId },
                    _sum: { quantity: true },
                });

                // Calculate percentage change if needed (placeholder logic)
                const previousTotal = 0; // Replace with actual logic if needed
                const percentChange = previousTotal ? ((totalAmount._sum.quantity || 0) - previousTotal) / previousTotal * 100 : 0;

                socket.emit('totalData', {
                    status: 'success',
                    total: totalAmount._sum.quantity || 0,
                    percent: percentChange,
                });
            } catch (error) {
                console.error(error);
                socket.emit('totalData', { status: 'fail', message: 'Error fetching total data' });
            }
        });
    };
};

export default teamHandler;






