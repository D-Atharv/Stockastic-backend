import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export async function getStockByName(stockName: string) {
    return await prisma.stock.findFirst({
        where: { stockName: stockName },
        include: {
            prices: {
                orderBy: { priceDate: 'desc' },
                take: 1,
                select: {
                    price: true,
                    openingPrice: true,
                    lowerRange: true,
                    upperRange: true,
                    id: true,

                }
            }
        }
    });
}