import { Server, Socket } from 'socket.io';
import { stocks } from '../../data/stock';

//Function to release stocks by Admin
export function releaseStocks(stockId: string, quantity: number): boolean {
    const stock = stocks.find(stock => stock.ticker === stockId);
    if (!stock || quantity > stock.shares75Percent) {
        return false; // Not enough reserved stocks to release or stock not found
    }
    stock.shares75Percent -= quantity;
    stock.shares25Percent += quantity;
    return true;
}


// Handle admin actions to release more stocks
export function handleAdminActions(socket: Socket) {
    socket.on('releaseStocks', async (data) => {
        const { stockId, quantity } = data;

        if (quantity <= 0) {
            socket.emit('adminError', { message: 'Invalid quantity specified' });
            return;
        }

        const result = releaseStocks(stockId, quantity);
        if (result) {
            socket.emit('stocksReleased', { stockId, quantity });
        } else {
            socket.emit('adminError', { message: 'Unable to release stocks: Stock not found or insufficient reserved stocks' });
        }
    })
}