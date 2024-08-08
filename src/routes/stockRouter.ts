import express, { Request, Response, RequestHandler } from "express";
import getStocks from "../controllers/stockController";
const router = express.Router();

router.get('/stocks', getStocks);
export default router;