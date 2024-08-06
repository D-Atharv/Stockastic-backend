import 'dotenv/config';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Clear existing Stock data (optional, uncomment if needed)
    // await prisma.stock.deleteMany({});

    // Seed Stock data
    const stocks = await prisma.stock.createMany({
        data: [
            { ticker: 'AAPL', stockName: 'Apple Inc.', participantStocks: 1000, promoterStocks: 2000 },
            { ticker: 'GOOGL', stockName: 'Alphabet Inc.', participantStocks: 1500, promoterStocks: 2500 },
            // Add more stocks as needed
        ],
    });

    console.log('Stocks seeded:', stocks);

    // Fetch stock IDs and names to use in stock prices
    const stocksFromDb = await prisma.stock.findMany({ select: { id: true, stockName: true } });

    // Seed StockPrice data
    const stockPrices = await prisma.stockPrice.createMany({
        data: stocksFromDb.map(stock => ({
            stockId: stock.id,
            stockName: stock.stockName, // Include stockName
            price: 150.0, // Adjust the price as needed for each stock
            openingPrice: 145.0,
            lowerRange: 140.0,
            upperRange: 155.0,
            priceDate: new Date() // You can set this to a specific date if needed
        })),
    });

    console.log('Stock prices seeded:', stockPrices);
}

main()
    .catch(e => {
        console.error('Error seeding data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

