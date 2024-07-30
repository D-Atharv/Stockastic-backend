import { stocks } from "../../data/stock";
import prisma from "../../db/prisma";

export function calculateStockPrice(stockId: string): number | null {
    const stock = stocks.find((stock) => stock.ticker === stockId);

    if (!stock) return null;

    const { openingPrice, ratioRange, shares25Percent } = stock;
    const ratio = Math.random() * (ratioRange[1] - ratioRange[0]) + ratioRange[0];

    return openingPrice + shares25Percent * ratio;
}

export async function updateStockAfterTransaction(
    stockId: string,
    quantity: number,
    teamId: number,
    action: "buy" | "sell"
): Promise<number | null> {

    const stock = stocks.find((stock) => stock.ticker === stockId);

    // const team = await prisma.team.findUnique({
    //     where: {
    //         id: teamId,
    //     },
    // });

    // if (!stock || !team) return null;

    if (!stock) return null;

    const totalCost = quantity * stock.openingPrice;

    if (action === "buy") {
        // if (quantity > stock.shares25Percent || totalCost > team.funds) {} / Not enough stock available to buy or insufficient funds

        if (quantity > stock.shares25Percent) {
            return null;
        }
        stock.shares25Percent -= quantity;
        // team.funds -= totalCost; // Deducting the cost from team's funds

    } else if (action === "sell") {
        // if (quantity > team.stocks) {return null; }

        if (quantity > stock.shares25Percent) {
            return null;
        }

        stock.shares25Percent += quantity;
        // team.funds += totalCost; // Adding the revenue to team's funds
    }

    return calculateStockPrice(stockId);
}
