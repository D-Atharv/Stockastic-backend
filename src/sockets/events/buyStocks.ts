import { Socket } from 'socket.io';
import { updateStockAfterTransaction } from '../socket_utils/socketUtils';

export function handleBuyStock(socket: Socket) {
    socket.on('buyStock', async (data) => {
        const { stockId, quantity } = data;

        const newPrice = updateStockAfterTransaction(stockId, quantity, 'buy');

        if (newPrice !== null) {
            socket.emit('buyStockResult', { stockId, newPrice });
        } else {
            socket.emit('error', { message: 'Stock not found' });
        }
    });
}