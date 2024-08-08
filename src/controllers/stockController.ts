import { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getStocks = async (req: Request, resp: Response) => {

    try {
        const stocks = await prisma.stock.findMany();

        resp.json({ status: 'success', companies: stocks });
    } catch (error) {
        console.error(error);
        resp.status(500).json({ status: 'fail', err: 'Internal Server Error' });
    }
};

export default getStocks;