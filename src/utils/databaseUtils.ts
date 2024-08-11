// src/utils/databaseUtils.ts
import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch all stocks
export async function fetchAllStocks() {
    return prisma.stock.findMany();
}

// Fetch a user's portfolio
export async function fetchPortfolio(userId: number) {
    return prisma.portfolio.findFirst({
        where: { team: { members: { some: { id: userId } } } },
        include: { transactions: true, Holdings: true }
    });
}

// Create a transaction
export async function createTransaction(
    type: TransactionType,
    quantity: number,
    price: number,
    portfolioId: number,
    stockId: number
) {
    return prisma.transaction.create({
        data: {
            transactionType: type,
            quantity,
            price,
            portfolioId,
            stockId
        }
    });
}

// Update stock holdings
export async function updateHoldings(
    portfolioId: number,
    stockId: number,
    quantity: number,
    avgPrice: number
) {
    const existingHolding = await prisma.holdings.findFirst({
        where: { portfolioId, stockId }
    });

    if (existingHolding) {
        return prisma.holdings.update({
            where: { id: existingHolding.id },
            data: {
                quantity: existingHolding.quantity + quantity,
                avgPrice: (existingHolding.avgPrice + avgPrice) / 2
            }
        });
    } else {
        return prisma.holdings.create({
            data: {
                portfolioId,
                stockId,
                quantity,
                avgPrice
            }
        });
    }
}

// Fetch wallet balance
export async function fetchWalletBalance(teamId: number) {
    return prisma.portfolio.findUnique({
        where: { teamId }
    });
}

// Handle stock sell
export async function handleStockSell(
    portfolioId: number,
    stockId: number,
    quantity: number
) {
    const holdings = await prisma.holdings.findFirst({
        where: { portfolioId, stockId }
    });

    if (holdings && holdings.quantity >= quantity) {
        return prisma.holdings.update({
            where: { id: holdings.id },
            data: { quantity: holdings.quantity - quantity }
        });
    } else {
        throw new Error('Insufficient quantity or holding not found');
    }
}

export default prisma;
