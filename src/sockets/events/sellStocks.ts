import { Socket } from 'socket.io';
import { updateStockAfterTransaction } from '../socket_utils/socketUtils';

export function handleSellStock(socket: Socket) {
    socket.on('sellStock', async (data) => {
        const { stockId, quantity } = data;

        const newPrice = updateStockAfterTransaction(stockId, quantity, 'sell');

        if (newPrice !== null) {
            socket.emit('sellStockResult', { stockId, newPrice });
        } else {
            socket.emit('error', { message: 'Stock not found' });
        }
    });
}