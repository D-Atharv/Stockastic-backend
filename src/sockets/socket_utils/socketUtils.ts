import { stocks } from '../../data/stock';

export function calculateStockPrice(stockId: string): number | null {
    const stock = stocks.find(stock => stock.id === stockId);

    if (!stock) return null;

    const { openingPrice, ratioRange, floatingStocks } = stock;
    const ratio = Math.random() * (ratioRange[1] - ratioRange[0]) + ratioRange[0];

    return openingPrice + (floatingStocks * ratio);
}

export function updateStockAfterTransaction(stockId: string, quantity: number, action: 'buy' | 'sell') {
    const stock = stocks.find(stock => stock.id === stockId);

    if (!stock) return null;

    if (action === 'buy') {
        stock.floatingStocks -= quantity;
    } else if (action === 'sell') {
        stock.floatingStocks += quantity;
    }

    return calculateStockPrice(stockId);
}
