import { Socket } from 'socket.io';
import { updateStockAfterTransaction } from '../socket_utils/socketUtils';

export function handleBuyStock(socket: Socket) {
    socket.on('buyStock', async (data) => {
        const { stockId, quantity, teamId } = data;

        if (quantity <= 0) {
            socket.emit('error', { message: 'Invalid quantity specified' });
            return;
        }

        const newPrice = updateStockAfterTransaction(stockId, quantity, teamId, 'buy');

        if (newPrice !== null) {
            socket.emit('buyStockResult', { stockId, newPrice });
            // socket.emit('buyStockResult', { stockId, newPrice, remainingFunds: teams.find(team => team.id === teamId).funds });
        } else {
            socket.emit('error', { message: 'Stock not found' });
            // socket.emit('error', { message: 'Unable to complete purchase: Stock not found, insufficient quantity, or insufficient funds' });
        }
    });
}