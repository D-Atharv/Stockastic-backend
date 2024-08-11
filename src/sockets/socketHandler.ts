import { Server, Socket } from 'socket.io';
import fetchStocksHandler from './events/fetchStockHandler';
import buyStockHandler from './events/buyStockHandler';
import fetchWalletHandler from './events/fetchWalletHandler';
import transactionHandler from './events/transactionHandler';
import stockHandler from './events/stockHandler';
import teamHandler from './events/teamHandler';


const registerSocketHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('New client connected');

        fetchStocksHandler(socket);
        buyStockHandler(socket);
        fetchWalletHandler(socket)
        transactionHandler(socket);

        stockHandler(socket);

        teamHandler(socket);


        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

export default registerSocketHandlers;
