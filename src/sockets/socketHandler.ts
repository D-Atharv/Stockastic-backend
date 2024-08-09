// socketHandlers.ts
import { Server, Socket } from 'socket.io';
import fetchStocksHandler from './events/fetchStockHandler';
import buyStockHandler from './events/buyStockHandler';

const registerSocketHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('New client connected');

        // Register individual handlers
        fetchStocksHandler(socket);
        buyStockHandler(socket);

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

export default registerSocketHandlers;
