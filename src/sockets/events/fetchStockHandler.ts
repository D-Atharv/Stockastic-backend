import { Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fetchStocksHandler = (socket: Socket) => {
    socket.on('fetchStocks', async () => {
        try {
            const stocks = await prisma.stock.findMany();
            socket.emit('getStocks', { status: 'success', companies: stocks });
        } catch (error) {
            console.error('Error fetching stocks:', error);
            socket.emit('getStocks', { status: 'fail', err: 'Internal Server Error' });
        }
    });
};

export default fetchStocksHandler;
