import { Server, Socket } from 'socket.io';
import { handleBuyStock } from '../sockets/events/buyStocks';
import { handleSellStock } from '../sockets/events/sellStocks';

export function setupSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log('A user connected');

        // Use event handlers
        handleBuyStock(socket);
        handleSellStock(socket);

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
}
