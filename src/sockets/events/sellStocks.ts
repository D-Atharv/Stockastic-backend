import { Socket } from 'socket.io';
import { updateStockAfterTransaction } from '../socket_utils/socketUtils';

export function handleSellStock(socket: Socket) {
    socket.on('sellStock', async (data) => {
        const { stockId, quantity, teamId } = data;

        if (quantity <= 0) {
            socket.emit('error', { message: 'Invalid quantity specified' });
            return;
        }

        const newPrice = updateStockAfterTransaction(stockId, quantity, teamId, 'sell');

        if (newPrice !== null) {
            socket.emit('sellStockResult', { stockId, newPrice });
            // socket.emit('sellStockResult', { stockId, newPrice, remainingFunds: teams.find(team => team.id === teamId).funds });
        } else {
            socket.emit('error', { message: 'Stock not found' });
            // socket.emit('error', { message: 'Stock not found or insufficient quantity' });
        }
    });
}