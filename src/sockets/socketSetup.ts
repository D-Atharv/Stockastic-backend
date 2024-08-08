// socketSetup.ts
import { Server } from 'socket.io';
import registerStockHandlers from '../controllers/stockController';
// import registerTransactionHandlers from '../controllers/transactionController';

const registerSocketHandlers = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Register specific event handlers
        registerStockHandlers(socket);
        // registerTransactionHandlers(socket);

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

export default registerSocketHandlers;
