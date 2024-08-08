import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const registerStockHandlers = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('fetchStocks', async () => {
            try {
                const stocks = await prisma.stock.findMany();
                socket.emit('getStocks', { status: 'success', companies: stocks });
            } catch (error) {
                console.error('Error fetching stocks:', error);
                socket.emit('getStocks', { status: 'fail', err: 'Internal Server Error' });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

export default registerStockHandlers;


