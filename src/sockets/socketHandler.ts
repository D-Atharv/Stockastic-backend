import { Server, Socket } from 'socket.io';
import fetchStocksHandler from './events/fetchStockHandler';
import buyStockHandler from './events/buyStockHandler';
import fetchWalletHandler from './events/fetchWalletHandler';

const registerSocketHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('New client connected');

        fetchStocksHandler(socket);
        buyStockHandler(socket);
        fetchWalletHandler(socket)

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

export default registerSocketHandlers;
