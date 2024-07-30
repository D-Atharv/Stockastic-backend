import { Server, Socket } from 'socket.io';
import { handleBuyStock } from '../sockets/events/buyStocks';
import { handleSellStock } from '../sockets/events/sellStocks';
import { handleAdminActions } from '../sockets/events/adminReleaseStocks';

export function setupSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log('A user connected');

        // Use event handlers
        handleBuyStock(socket);
        handleSellStock(socket);

        //admin actions
        handleAdminActions(socket);

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
}
